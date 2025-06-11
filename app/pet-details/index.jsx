import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components
} from '../../utils/responsive';

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
        });
    }, [navigation]);

    // Enhanced adoption flow with better UX
    const InitiateChat = async () => {
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            Alert.alert(
                "Login Required",
                "Please login to start chatting with the pet owner.",
                [{ text: "OK" }]
            );
            return;
        }

        if (!pet?.email) {
            Alert.alert(
                "Error",
                "Pet owner information is not available.",
                [{ text: "OK" }]
            );
            return;
        }

        // Check if user is trying to adopt their own pet
        if (user.primaryEmailAddress.emailAddress === pet.email) {
            Alert.alert(
                "Cannot Adopt",
                "You cannot adopt your own pet!",
                [{ text: "OK" }]
            );
            return;
        }

        // Show confirmation dialog
        Alert.alert(
            "Start Adoption Process",
            `Are you interested in adopting ${pet.name}? This will start a chat with the owner.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, I'm Interested",
                    onPress: () => handleAdoptionProcess(),
                    style: "default"
                }
            ]
        );
    };

    const handleAdoptionProcess = async () => {
        setIsLoading(true);

        // Button animation
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        try {
            const userEmail = user.primaryEmailAddress.emailAddress;
            const petOwnerEmail = pet.email;
            const docId1 = `${userEmail}_${petOwnerEmail}`;
            const docId2 = `${petOwnerEmail}_${userEmail}`;

            // Check if chat already exists
            const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const chatDoc = querySnapshot.docs[0];
                router.push({
                    pathname: '/chat',
                    params: { id: chatDoc.id },
                });
                return;
            }

            // Create new chat
            await setDoc(doc(db, 'Chat', docId1), {
                id: docId1,
                users: [
                    {
                        email: userEmail,
                        imageUrl: user.imageUrl,
                        name: user.fullName,
                    },
                    {
                        email: petOwnerEmail,
                        imageUrl: pet.userImage,
                        name: pet.username,
                    }
                ],
                userIds: [userEmail, petOwnerEmail],
                createdAt: new Date().toISOString(),
                petInfo: {
                    id: pet.id,
                    name: pet.name,
                    imageUrl: pet.imageUrl,
                }
            });

            // Success feedback
            Alert.alert(
                "Chat Started!",
                `You can now chat with ${pet.username} about adopting ${pet.name}.`,
                [{
                    text: "Start Chatting",
                    onPress: () => router.push({
                        pathname: '/chat',
                        params: { id: docId1 },
                    })
                }]
            );

        } catch (error) {
            console.error('Error initiating chat:', error);
            Alert.alert(
                "Error",
                "Failed to start chat. Please check your connection and try again.",
                [{ text: "OK" }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <PetInfo pet={pet} />
                <PetSubInfo pet={pet} />
                <AboutPet pet={pet} />
                <OwnerInfo pet={pet} />
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Enhanced Adopt Button */}
            <View style={styles.bottomContainer}>
                <Animated.View style={[styles.adoptButtonContainer, { transform: [{ scale: buttonScale }] }]}>
                    <TouchableOpacity
                        onPress={InitiateChat}
                        style={styles.adoptBtn}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={isLoading ? ['#ccc', '#999'] : ['#667eea', '#764ba2']}
                            style={styles.adoptBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.adoptBtnContent}>
                                {isLoading ? (
                                    <>
                                        <MaterialIcons name="hourglass-empty" size={24} color="white" />
                                        <Text style={styles.adoptBtnText}>Processing...</Text>
                                    </>
                                ) : (
                                    <>
                                        <MaterialIcons name="favorite" size={24} color="white" />
                                        <Text style={styles.adoptBtnText}>Adopt Me</Text>
                                        <MaterialIcons name="arrow-forward" size={20} color="white" />
                                    </>
                                )}
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    bottomContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        paddingHorizontal: responsivePadding.horizontal,
        paddingVertical: spacing.lg,
        paddingBottom: deviceInfo.isTablet ? spacing.lg : spacing.lg + 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e1e5e9',
        ...shadow.large,
        shadowOffset: { width: 0, height: -2 },
    },
    adoptButtonContainer: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadow.large,
        shadowColor: '#667eea',
    },
    adoptBtn: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    adoptBtnGradient: {
        paddingVertical: deviceInfo.isTablet ? spacing.xl : spacing.lg,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: components.button.height,
    },
    adoptBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
    },
    adoptBtnText: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.title : fontSize.xl,
        color: 'white',
        fontWeight: 'bold',
    }
});
