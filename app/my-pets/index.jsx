import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';

export default function MyPets() {
    const { user } = useUser();
    const [myPets, setMyPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) {
            fetchMyPets();
        }
    }, [user]);

    const fetchMyPets = async () => {
        try {
            setLoading(true);
            const userEmail = user?.primaryEmailAddress?.emailAddress;
            
            const q = query(collection(db, 'Pets'), where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);
            
            const pets = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setMyPets(pets);
        } catch (error) {
            console.error('Error fetching my pets:', error);
            Alert.alert('Error', 'Failed to load your pets. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchMyPets();
    };

    const handleDeletePet = (petId, petName) => {
        Alert.alert(
            "Delete Pet",
            `Are you sure you want to remove ${petName} from your listings?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: () => deletePet(petId)
                }
            ]
        );
    };

    const deletePet = async (petId) => {
        try {
            await deleteDoc(doc(db, 'Pets', petId));
            setMyPets(prev => prev.filter(pet => pet.id !== petId));
            Alert.alert('Success', 'Pet removed successfully!');
        } catch (error) {
            console.error('Error deleting pet:', error);
            Alert.alert('Error', 'Failed to delete pet. Please try again.');
        }
    };

    const renderPetItem = ({ item }) => (
        <View style={styles.petCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
            
            <View style={styles.petInfo}>
                <View style={styles.petHeader}>
                    <Text style={styles.petName}>{item.name}</Text>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.Category}</Text>
                    </View>
                </View>
                
                <Text style={styles.petDetails}>
                    {item.breed} • {item.age} years • {item.weight}kg
                </Text>
                
                <Text style={styles.petLocation}>
                    <MaterialIcons name="location-on" size={14} color="#666" />
                    {item.address}
                </Text>
                
                <Text style={styles.petDate}>
                    Listed {moment(item.createdAt).fromNow()}
                </Text>
            </View>
            
            <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => {
                        // Navigate to edit pet page (to be implemented)
                        Alert.alert('Coming Soon', 'Edit functionality will be available soon!');
                    }}
                >
                    <MaterialIcons name="edit" size={20} color="#667eea" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeletePet(item.id, item.name)}
                >
                    <MaterialIcons name="delete" size={20} color="#ff6b6b" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.emptyIconContainer}
            >
                <MaterialIcons name="pets" size={60} color="white" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No Pets Listed Yet</Text>
            <Text style={styles.emptySubtitle}>
                Start by adding your first pet to help them find a loving home
            </Text>
            <TouchableOpacity 
                style={styles.addPetButton}
                onPress={() => router.push('/add-new-pet')}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.addPetButtonGradient}
                >
                    <MaterialIcons name="add" size={20} color="white" />
                    <Text style={styles.addPetButtonText}>Add Your First Pet</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>My Pets</Text>
                        <Text style={styles.headerSubtitle}>
                            {myPets.length} {myPets.length === 1 ? 'pet' : 'pets'} listed
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => router.push('/add-new-pet')}
                    >
                        <MaterialIcons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text style={styles.loadingText}>Loading your pets...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={myPets}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPetItem}
                        ListEmptyComponent={renderEmptyState}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={myPets.length === 0 ? styles.emptyListContainer : styles.listContainer}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'PermanentMarker-Regular',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Pacifico-Regular',
        marginTop: 4,
    },
    addButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#667eea',
        fontFamily: 'PermanentMarker-Regular',
    },
    listContainer: {
        paddingBottom: 20,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    petCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
    },
    petInfo: {
        flex: 1,
    },
    petHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'PermanentMarker-Regular',
        flex: 1,
    },
    categoryBadge: {
        backgroundColor: '#667eea',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    petDetails: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Pacifico-Regular',
        marginBottom: 4,
    },
    petLocation: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Pacifico-Regular',
        marginBottom: 4,
    },
    petDate: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Pacifico-Regular',
    },
    actionButtons: {
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingLeft: 16,
    },
    editButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginBottom: 8,
    },
    deleteButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#ffe6e6',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'PermanentMarker-Regular',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Pacifico-Regular',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    addPetButton: {
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    addPetButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 8,
    },
    addPetButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'PermanentMarker-Regular',
    },
});
