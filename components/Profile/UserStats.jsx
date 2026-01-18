import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Shared from '../../Shared/Shared';
import { spacing, fontSize, borderRadius, shadow } from '../../utils/responsive';
import { MaterialIcons } from '@expo/vector-icons';

const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <MaterialIcons name={icon} size={28} color="white" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const UserStatsSkeleton = () => {
    const pulse = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0.6, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.statsContainer}>
            {[1, 2, 3].map(i => (
                <Animated.View key={i} style={[styles.statCard, styles.skeletonStatCard, { opacity: pulse }]} />
            ))}
        </View>
    );
};


export default function UserStats({ user }) {
    const [stats, setStats] = useState({
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
        setLoading(true);
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

            setStats({
                totalPets: petsSnapshot.size,
                // Note: This counts conversations, not necessarily confirmed adoptions.
                adoptedPets: chatsSnapshot.size,
                favoritePets: favList.favorites?.length || 0
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <UserStatsSkeleton />;
    }

    return (
        <View style={styles.statsContainer}>
            <StatCard icon="pets" value={stats.totalPets} label="Pets Listed" color="#667eea" />
            <StatCard icon="favorite" value={stats.favoritePets} label="Favorites" color="#ff6b6b" />
            <StatCard icon="chat" value={stats.adoptedPets} label="Adoptions" color="#764ba2" />
        </View>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: spacing.md,
        marginTop: -40, // Overlap with header
        marginBottom: spacing.lg,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: spacing.sm,
        ...shadow.medium,
    },
    iconContainer: {
        padding: spacing.sm,
        borderRadius: 50,
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: fontSize.h3,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: fontSize.sm,
        color: '#666',
        marginTop: spacing.xs,
    },
    skeletonStatCard: {
        height: 120,
        backgroundColor: '#e3e6f3',
    },
}); 