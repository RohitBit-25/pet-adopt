import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/clerk-expo'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components,
    grid
} from '../../utils/responsive';

export default function Profile() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const [userStats, setUserStats] = useState({
        totalPets: 0,
        adoptedPets: 0,
        favoritePets: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserStats();
        }
    }, [user]);

    const fetchUserStats = async () => {
        try {
            setLoading(true);
            const userEmail = user?.primaryEmailAddress?.emailAddress;

            // Fetch user's pets
            const petsQuery = query(collection(db, 'Pets'), where('email', '==', userEmail));
            const petsSnapshot = await getDocs(petsQuery);

            // Fetch user's chats (adoption conversations)
            const chatsQuery = query(collection(db, 'Chat'), where('userIds', 'array-contains', userEmail));
            const chatsSnapshot = await getDocs(chatsQuery);

            setUserStats({
                totalPets: petsSnapshot.size,
                adoptedPets: chatsSnapshot.size,
                favoritePets: 0 // Will be updated from favorites
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace('/login');
                        } catch (error) {
                            console.error('Error signing out:', error);
                            Alert.alert('Error', 'Failed to sign out. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const profileOptions = [
        {
            id: 1,
            title: 'My Pets',
            subtitle: 'Manage your listed pets',
            icon: 'pets',
            color: '#667eea',
            onPress: () => router.push('/my-pets')
        },
        {
            id: 2,
            title: 'Adoption History',
            subtitle: 'View your adoption conversations',
            icon: 'history',
            color: '#764ba2',
            onPress: () => router.push('/(tabs)/inbox')
        },
        {
            id: 3,
            title: 'Favorites',
            subtitle: 'Your favorite pets',
            icon: 'favorite',
            color: '#ff6b6b',
            onPress: () => router.push('/(tabs)/favorite')
        },
        {
            id: 4,
            title: 'Settings',
            subtitle: 'App preferences',
            icon: 'settings',
            color: '#4ecdc4',
            onPress: () => Alert.alert('Coming Soon', 'Settings feature will be available soon!')
        },
        {
            id: 5,
            title: 'Help & Support',
            subtitle: 'Get help and support',
            icon: 'help',
            color: '#45b7d1',
            onPress: () => Alert.alert('Help & Support', 'Contact us at support@petadopt.com')
        }
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.headerGradient}
            >
                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: user?.imageUrl || 'https://via.placeholder.com/100' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>{user?.fullName || 'Pet Lover'}</Text>
                    <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
                </View>
            </LinearGradient>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={styles.statsCard}>
                    <MaterialIcons name="pets" size={24} color="#667eea" />
                    <Text style={styles.statsNumber}>{userStats.totalPets}</Text>
                    <Text style={styles.statsLabel}>My Pets</Text>
                </View>
                <View style={styles.statsCard}>
                    <MaterialIcons name="chat" size={24} color="#764ba2" />
                    <Text style={styles.statsNumber}>{userStats.adoptedPets}</Text>
                    <Text style={styles.statsLabel}>Conversations</Text>
                </View>
                <View style={styles.statsCard}>
                    <MaterialIcons name="favorite" size={24} color="#ff6b6b" />
                    <Text style={styles.statsNumber}>{userStats.favoritePets}</Text>
                    <Text style={styles.statsLabel}>Favorites</Text>
                </View>
            </View>

            {/* Profile Options */}
            <View style={styles.optionsContainer}>
                {profileOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.optionItem}
                        onPress={option.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                            <MaterialIcons name={option.icon} size={24} color={option.color} />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>{option.title}</Text>
                            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <MaterialIcons name="logout" size={24} color="#ff6b6b" />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileHeader: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 16,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'PermanentMarker-Regular',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Pacifico-Regular',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginTop: -20,
        marginBottom: 30,
    },
    statsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    statsNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        fontFamily: 'PermanentMarker-Regular',
    },
    statsLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontFamily: 'Pacifico-Regular',
    },
    optionsContainer: {
        paddingHorizontal: 20,
    },
    optionItem: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    optionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'PermanentMarker-Regular',
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
        fontFamily: 'Pacifico-Regular',
    },
    signOutButton: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#ff6b6b',
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    signOutText: {
        fontSize: 18,
        color: '#ff6b6b',
        fontWeight: '600',
        marginLeft: 8,
        fontFamily: 'PermanentMarker-Regular',
    },
});