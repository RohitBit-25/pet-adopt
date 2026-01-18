import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { router } from 'expo-router';

const quizQuestions = [
    {
        question: 'What type of pet are you looking for?',
        options: ['Dog', 'Cat', 'Bird', 'Fish'],
        key: 'type',
    },
    {
        question: 'What size pet do you prefer?',
        options: ['Small', 'Medium', 'Large'],
        key: 'size',
    },
    {
        question: 'How active are you?',
        options: ['Couch Potato', 'Moderately Active', 'Very Active'],
        key: 'activity',
    },
    {
        question: 'Do you have allergies to fur?',
        options: ['Yes', 'No'],
        key: 'allergies',
    },
    {
        question: 'Is the pet neutered/spayed?',
        options: ['Yes', 'No'],
        key: 'isNeutered',
    },
];

// Weight ranges for size filtering (in kg)
const sizeFilters = {
    Small: (weight) => weight < 10,
    Medium: (weight) => weight >= 10 && weight <= 25,
    Large: (weight) => weight > 25,
};

const activityMap = {
    'Couch Potato': 'low',
    'Moderately Active': 'moderate',
    'Very Active': 'high',
};

export default function MatchQuiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [matchedPets, setMatchedPets] = useState([]);
    const [loading, setLoading] = useState(false);

    const findMatches = useCallback(async (currentAnswers) => {
        setLoading(true);
        try {
            // 1. Firestore query by type and activityLevel
            let q = query(
                collection(db, 'Pets'),
                where('Category', '==', currentAnswers.type),
                where('activityLevel', '==', activityMap[currentAnswers.activity] || 'moderate')
            );
            const snapshot = await getDocs(q);
            let pets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // 2. Client-side filtering by size
            if (currentAnswers.size && sizeFilters[currentAnswers.size]) {
                pets = pets.filter(pet => sizeFilters[currentAnswers.size](parseFloat(pet.weight)));
            }

            // 3. Filter by allergies (hypoallergenic)
            if (currentAnswers.allergies === 'Yes') {
                pets = pets.filter(pet => pet.isHypoallergenic === true);
            }

            // 4. Filter by neutered/spayed status
            if (currentAnswers.isNeutered === 'Yes') {
                pets = pets.filter(pet => pet.isNeutered === true);
            }

            // 4. Shuffle and take top 5
            const finalMatches = pets.sort(() => 0.5 - Math.random()).slice(0, 5);
            setMatchedPets(finalMatches);

        } catch (e) {
            console.error("Error finding matches:", e);
            Alert.alert("Error", "Could not find matches. Please try again.");
            setMatchedPets([]);
        } finally {
            setShowResults(true);
            setLoading(false);
        }
    }, []);

    const handleSelect = (option) => {
        const key = quizQuestions[step].key;
        const newAnswers = { ...answers, [key]: option };
        setAnswers(newAnswers);

        if (step < quizQuestions.length - 1) {
            setStep(step + 1);
        } else {
            findMatches(newAnswers);
        }
    };

    const handleRestart = () => {
        setStep(0);
        setAnswers({});
        setShowResults(false);
        setMatchedPets([]);
    };

    if (loading && !showResults) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Finding your best match...</Text>
            </View>
        );
    }

    if (showResults) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Your Matches</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#667eea" />
                ) : matchedPets.length === 0 ? (
                    <Text style={styles.subtitle}>No matches found. Try different answers!</Text>
                ) : (
                    <FlatList
                        data={matchedPets}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Pressable style={styles.petCard} onPress={() => router.push(`/pet-details/${item.id}`)}>
                                <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.petName}>{item.name}</Text>
                                    <Text style={styles.petBreed}>{item.breed}</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#667eea" />
                            </Pressable>
                        )}
                    />
                )}
                <Pressable onPress={handleRestart} style={styles.restartButton}>
                    <LinearGradient colors={['#ff6b6b', '#667eea']} style={styles.restartButtonGradient}>
                        <MaterialIcons name="refresh" size={20} color="white" />
                        <Text style={styles.restartButtonText}>Retake Quiz</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        );
    }

    const q = quizQuestions[step];
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pet Matchmaking Quiz</Text>
            <Text style={styles.question}>{q.question}</Text>
            {q.options.map((option) => (
                <Pressable
                    key={option}
                    onPress={() => handleSelect(option)}
                    style={({ pressed }) => [styles.optionButton, pressed && { transform: [{ scale: 0.97 }] }]}
                >
                    <LinearGradient colors={['#ff6b6b', '#667eea']} style={styles.optionButtonGradient}>
                        <Text style={styles.optionText}>{option}</Text>
                    </LinearGradient>
                </Pressable>
            ))}
            <Text style={styles.progress}>{step + 1} / {quizQuestions.length}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 24,
        paddingTop: 60,
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        color: '#667eea',
        fontFamily: 'PermanentMarker-Regular',
    },
    title: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 28,
        color: '#667eea',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Pacifico-Regular',
        fontSize: 18,
        color: '#333',
        marginBottom: 24,
        textAlign: 'center',
    },
    question: {
        fontFamily: 'Pacifico-Regular',
        fontSize: 20,
        color: '#333',
        marginBottom: 24,
        textAlign: 'center',
    },
    optionButton: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    optionButtonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        borderRadius: 16,
    },
    optionText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'PermanentMarker-Regular',
    },
    progress: {
        marginTop: 24,
        color: '#999',
        fontFamily: 'Pacifico-Regular',
        fontSize: 16,
        textAlign: 'center',
    },
    petCard: {
        backgroundColor: 'white',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 16,
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 16,
    },
    petName: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 18,
        color: '#333',
    },
    petBreed: {
        fontFamily: 'Pacifico-Regular',
        fontSize: 14,
        color: '#666',
    },
    restartButton: {
        marginTop: 24,
        borderRadius: 20,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    restartButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 8,
        borderRadius: 20,
    },
    restartButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'PermanentMarker-Regular',
        marginLeft: 8,
    },
}); 