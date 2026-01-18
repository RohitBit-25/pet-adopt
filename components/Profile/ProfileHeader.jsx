import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { withSafeComponent } from '../Common/SafeComponent';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import {
    spacing,
    borderRadius,
    shadow,
    deviceInfo,
    responsivePadding,
    components
} from '../../utils/responsive';

function ProfileHeader({ user, onEditProfile }) {
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getMemberSince = (date) => {
        if (!date) return 'Recently';
        const now = new Date();
        const memberDate = date.toDate ? date.toDate() : new Date(date);
        const diffTime = Math.abs(now - memberDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) return `${diffDays} days`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
        return `${Math.floor(diffDays / 365)} years`;
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            {user?.photoURL ? (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>
                                        {getInitials(user?.displayName)}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.onlineIndicator} />
                        </View>

                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>
                                {user?.displayName || 'Pet Lover'}
                            </Text>
                            <Text style={styles.userEmail}>
                                {user?.email || 'No email provided'}
                            </Text>
                            <Text style={styles.memberSince}>
                                Member since {getMemberSince(user?.metadata?.creationTime)}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={onEditProfile}
                        accessibilityRole="button"
                        accessibilityLabel="Edit profile"
                    >
                        <MaterialIcons name="edit" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                </View>

                {/* Verification Badge */}
                {user?.emailVerified && (
                    <View style={styles.verificationBadge}>
                        <MaterialIcons name="verified" size={16} color={colors.success} />
                        <Text style={styles.verificationText}>Verified</Text>
                    </View>
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
        paddingHorizontal: responsivePadding.horizontal,
    },
    headerGradient: {
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadow.large,
        shadowColor: colors.primary,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: spacing.lg,
    },
    avatar: {
        width: components.avatar.large,
        height: components.avatar.large,
        borderRadius: components.avatar.large / 2,
        borderWidth: 3,
        borderColor: colors.textLight,
    },
    avatarPlaceholder: {
        width: components.avatar.large,
        height: components.avatar.large,
        borderRadius: components.avatar.large / 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.textLight,
    },
    avatarText: {
        fontSize: typography.fontSize.h3,
        color: colors.textLight,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: spacing.xs,
        right: spacing.xs,
        width: spacing.md,
        height: spacing.md,
        borderRadius: spacing.md / 2,
        backgroundColor: colors.success,
        borderWidth: 2,
        borderColor: colors.textLight,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: typography.fontSize.h2,
        color: colors.textLight,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
    },
    userEmail: {
        fontSize: typography.fontSize.body,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: typography.fontFamily.accent,
        marginBottom: spacing.xs,
    },
    memberSince: {
        fontSize: typography.fontSize.small,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: typography.fontFamily.regular,
    },
    editButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: borderRadius.sm,
        padding: spacing.sm,
        ...shadow.small,
    },
    verificationBadge: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        gap: spacing.xs,
    },
    verificationText: {
        fontSize: typography.fontSize.small,
        color: colors.success,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
    },
});

export default withSafeComponent(ProfileHeader); 