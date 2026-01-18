import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { spacing, fontSize, borderRadius, shadow } from '../../utils/responsive';

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

const ProfileOptionItem = ({ item, index }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={styles.optionButton}
                onPress={item.onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={0.8}
            >
                <View style={[styles.optionIcon, { backgroundColor: item.color }]}>
                    <MaterialIcons name={item.icon} size={24} color="white" />
                </View>
                <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{item.title}</Text>
                    <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={18} color="#ccc" />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function ProfileOptions() {
    return (
        <View style={styles.optionsContainer}>
            {profileOptions.map((item, index) => (
                <ProfileOptionItem key={item.id} item={item} index={index} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    optionsContainer: {
        paddingHorizontal: spacing.md,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadow.medium,
    },
    optionIcon: {
        padding: spacing.sm,
        borderRadius: 50,
        marginRight: spacing.md,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: '#333',
    },
    optionSubtitle: {
        fontSize: fontSize.sm,
        color: '#666',
        marginTop: spacing.xs,
    },
}); 