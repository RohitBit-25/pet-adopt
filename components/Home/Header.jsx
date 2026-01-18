<<<<<<< HEAD
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { withSafeComponent } from '../Common/SafeComponent'
import colors from '../../theme/colors'
import typography from '../../theme/typography'
import {
    spacing,
    borderRadius,
    shadow,
    components,
    deviceInfo,
    responsivePadding
} from '../../utils/responsive';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';

function Header() {
    const { user } = useFirebaseAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getTimeString = () => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.headerContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <View style={styles.headerContent}>
                <View style={styles.userInfo}>
                    <Text style={styles.greetingText}>{getGreeting()}</Text>
                    <Text style={styles.userName}>{user?.displayName || 'Pet Lover'}</Text>
                    <Text style={styles.timeText}>{getTimeString()}</Text>
                </View>
                <View style={styles.rightSection}>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => {
                            router.push('/(tabs)/inbox');
                        }}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Notifications"
                    >
                        <MaterialIcons name="notifications" size={24} color={colors.textLight} />
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.profileImageContainer}
                        onPress={() => router.push('/(tabs)/profile')}
                        accessibilityRole="button"
                        accessibilityLabel="Profile"
                    >
                        <Image
                            source={{ uri: user?.photoURL || 'https://via.placeholder.com/50' }}
                            style={styles.profileImage}
                        />
                        <View style={styles.onlineIndicator} />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Quick Stats */}
            <View style={styles.quickStats}>
                <View style={styles.statItem}>
                    <MaterialIcons name="pets" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.statText}>Find Pets</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <MaterialIcons name="favorite" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.statText}>Save Favorites</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <MaterialIcons name="chat" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.statText}>Chat & Adopt</Text>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
        ...shadow.large,
        shadowColor: colors.primary,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsivePadding.horizontal,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    userInfo: {
        flex: 1,
    },
    greetingText: {
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.fontSize.body,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: spacing.xs,
    },
    userName: {
        fontFamily: typography.fontFamily.accent,
        fontSize: 24,
        color: colors.textLight,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs / 2,
    },
    timeText: {
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.fontSize.small,
        color: 'rgba(255,255,255,0.8)',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    notificationButton: {
        position: 'relative',
        padding: spacing.sm,
    },
    notificationBadge: {
        position: 'absolute',
        top: spacing.xs,
        right: spacing.xs,
        backgroundColor: colors.error,
        borderRadius: borderRadius.sm,
        width: spacing.lg,
        height: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: colors.textLight,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.bold,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: components.avatar.medium,
        height: components.avatar.medium,
        borderRadius: components.avatar.medium / 2,
        borderWidth: deviceInfo.isTablet ? 4 : 3,
        borderColor: colors.textLight,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: spacing.xs / 2,
        right: spacing.xs / 2,
        width: spacing.md,
        height: spacing.md,
        borderRadius: spacing.md / 2,
        backgroundColor: colors.success,
        borderWidth: 2,
        borderColor: colors.textLight,
    },
    quickStats: {
        flexDirection: deviceInfo.isTablet ? 'row' : 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: responsivePadding.horizontal,
        paddingBottom: spacing.lg,
        paddingTop: spacing.md,
        flexWrap: deviceInfo.isSmallPhone ? 'wrap' : 'nowrap',
    },
    statItem: {
        flexDirection: deviceInfo.isSmallPhone ? 'column' : 'row',
        alignItems: 'center',
        gap: deviceInfo.isSmallPhone ? spacing.xs : spacing.sm,
        minWidth: deviceInfo.isSmallPhone ? '30%' : 'auto',
    },
    statText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily.regular,
        fontWeight: typography.fontWeight.bold,
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
});

export default withSafeComponent(Header, 'Header');
=======
import { View, Text, Image } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'

export default function Header() {
    const { user } = useUser();
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

        }}>
            <View>
                <Text style={{
                    fontFamily: 'PermanentMarker-Regular',
                    fontSize: 18
                }}>Welcome,</Text>
                <Text style={{
                    fontFamily: 'Pacifico-Regular',
                    fontSize: 25
                }}>{user?.fullName}</Text>
            </View>
            <Image source={{ uri: user?.imageUrl }} style={{ width: 40, height: 40, borderRadius: 99 }} />
        </View>
    )
}
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
