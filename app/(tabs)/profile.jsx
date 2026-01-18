<<<<<<< HEAD
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import { withSafeComponent } from '../../components/Common/SafeComponent';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileOptions from '../../components/Profile/ProfileOptions';
import UserStats from '../../components/Profile/UserStats';
import ReviewsSection from '../../components/Profile/ReviewsSection';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import {
    spacing,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding
} from '../../utils/responsive';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Shared from '../../Shared/Shared';

function ProfileScreen() {
    const { user, loading } = useFirebaseAuth();
    const [userStats, setUserStats] = useState({
        totalPets: 0,
        adoptedPets: 0,
        favoritePets: 0
    });

    useEffect(() => {
        if (user) {
            fetchUserStats();
        }
    }, [user]);

    const fetchUserStats = async () => {
        try {
            const userEmail = user?.email;
            if (!userEmail) return;

            const petsQuery = query(collection(db, 'Pets'), where('email', '==', userEmail));
            const chatsQuery = query(collection(db, 'Chat'), where('userIds', 'array-contains', userEmail));

            const [petsSnapshot, chatsSnapshot, favList] = await Promise.all([
                getDocs(petsQuery),
                getDocs(chatsQuery),
                Shared.GetFavList(user)
            ]);

            setUserStats({
                totalPets: petsSnapshot.size,
                adoptedPets: chatsSnapshot.size,
                favoritePets: favList.favorites?.length || 0
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            router.replace('/login');
                        } catch (error) {
                            console.error('Sign out error:', error);
                            Alert.alert('Error', 'Failed to sign out');
                        }
                    }
                }
            ]
        );
    };

    const handleEditProfile = () => {
        router.push('/profile/edit');
    };

    const handleSettings = () => {
        router.push('/settings');
    };

    const handleHelp = () => {
        router.push('/help');
    };

    const handleMyPets = () => {
        router.push('/my-pets');
    };

    const handleEvents = () => {
        router.push('/events');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.authContainer}>
                <Text style={styles.authTitle}>Please Sign In</Text>
                <Text style={styles.authSubtitle}>Sign in to view your profile</Text>
                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={() => router.push('/login')}
                    accessibilityRole="button"
                    accessibilityLabel="Sign in to view profile"
                >
                    <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Profile Header */}
            <ProfileHeader user={user} onEditProfile={handleEditProfile} />

            {/* User Stats */}
            <UserStats user={user} />

            {/* Profile Options */}
            <ProfileOptions
                onSettings={handleSettings}
                onHelp={handleHelp}
                onSignOut={handleSignOut}
                extraOptions={[
                    {
                        label: 'My Pets',
                        icon: 'pets',
                        onPress: handleMyPets,
                    },
                    {
                        label: 'Events',
                        icon: 'event',
                        onPress: handleEvents,
                    },
                ]}
            />

            {/* Reviews Section */}
            <ReviewsSection userId={user.uid} />

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        paddingTop: deviceInfo.isTablet ? spacing.xl : spacing.lg,
        paddingBottom: spacing.xl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.regular,
    },
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: responsivePadding.horizontal,
    },
    authTitle: {
        fontSize: typography.fontSize.h2,
        color: colors.text,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    authSubtitle: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.accent,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    signInButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        ...shadow.medium,
    },
    signInButtonText: {
        color: colors.textLight,
        fontSize: typography.fontSize.body,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
    },
    bottomSpacing: {
        height: spacing.xl,
    },
});

export default withSafeComponent(ProfileScreen);
=======
import { View, Text } from 'react-native'
import React from 'react'

export default function Profile() {
    return (
        <View>
            <Text>Profile</Text>
        </View>
    )
}
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
