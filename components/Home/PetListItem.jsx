<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
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

function PetListItem({ item, onFavoriteToggle }) {
    const { user } = useFirebaseAuth();
    const [isFavorite, setIsFavorite] = useState(item?.favorites?.includes(user?.uid) || false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFavoritePress = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to save favorites');
            return;
        }

        setIsLoading(true);
        try {
            const petRef = doc(db, 'Pets', item.id);
            const newFavorites = isFavorite
                ? arrayRemove(user.uid)
                : arrayUnion(user.uid);

            await updateDoc(petRef, {
                favorites: newFavorites
            });

            setIsFavorite(!isFavorite);
            if (onFavoriteToggle) {
                onFavoriteToggle(item.id, !isFavorite);
            }
        } catch (error) {
            console.error('Error updating favorite:', error);
            Alert.alert('Error', 'Failed to update favorite');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePetPress = () => {
        router.push({
            pathname: '/pet-details',
            params: { petId: item.id }
        });
    };

    const getAgeText = (age) => {
        if (!age) return 'Unknown';
        if (age < 1) return `${Math.round(age * 12)} months`;
        if (age === 1) return '1 year';
        return `${age} years`;
    };

    const getGenderIcon = (gender) => {
        return gender?.toLowerCase() === 'male' ? 'male' : 'female';
    };

    const getGenderColor = (gender) => {
        return gender?.toLowerCase() === 'male' ? colors.info : colors.secondary;
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePetPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${item?.name}, ${item?.breed}, ${getAgeText(item?.age)} old`}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item?.imageUrl || 'https://via.placeholder.com/300x200' }}
                    style={styles.petImage}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                />

                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={handleFavoritePress}
                    disabled={isLoading}
                    accessibilityRole="button"
                    accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <MaterialIcons
                        name={isFavorite ? 'favorite' : 'favorite-border'}
                        size={24}
                        color={isFavorite ? colors.error : colors.textLight}
                    />
                </TouchableOpacity>

                {/* Gender Badge */}
                <View style={[styles.genderBadge, { backgroundColor: getGenderColor(item?.gender) }]}>
                    <MaterialIcons
                        name={getGenderIcon(item?.gender)}
                        size={16}
                        color={colors.textLight}
                    />
                </View>

                {/* Age Badge */}
                <View style={styles.ageBadge}>
                    <Text style={styles.ageText}>{getAgeText(item?.age)}</Text>
                </View>

                {/* Neutered Badge */}
                {item?.isNeutered && (
                    <View style={styles.neuteredBadge}>
                        <MaterialIcons name="content-cut" size={16} color={colors.textLight} />
                        <Text style={styles.neuteredText}>Neutered</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.petName} numberOfLines={1}>
                        {item?.name || 'Unknown Pet'}
                    </Text>
                    <Text style={styles.breed} numberOfLines={1}>
                        {item?.breed || 'Mixed Breed'}
                    </Text>
                </View>

                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {item?.location || 'Location not specified'}
                        </Text>
                    </View>

                    <View style={styles.detailItem}>
                        <MaterialIcons name="scale" size={16} color={colors.textSecondary} />
                        <Text style={styles.detailText}>
                            {item?.weight ? `${item.weight} kg` : 'Weight not specified'}
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.ownerInfo}>
                        <Image
                            source={{ uri: item?.ownerPhotoURL || 'https://via.placeholder.com/30' }}
                            style={styles.ownerImage}
                        />
                        <Text style={styles.ownerName} numberOfLines={1}>
                            {item?.ownerName || 'Unknown Owner'}
                        </Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>
                            {item?.price ? `$${item.price}` : 'Free'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
        overflow: 'hidden',
        ...shadow.medium,
    },
    imageContainer: {
        position: 'relative',
        height: deviceInfo.isTablet ? 200 : 160,
    },
    petImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
    },
    favoriteButton: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: borderRadius.sm,
        padding: spacing.xs,
        ...shadow.small,
    },
    genderBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        borderRadius: borderRadius.sm,
        padding: spacing.xs,
        ...shadow.small,
    },
    ageBadge: {
        position: 'absolute',
        bottom: spacing.sm,
        right: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    ageText: {
        color: colors.textLight,
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
    },
    content: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.md,
    },
    petName: {
        fontSize: typography.fontSize.h4,
        color: colors.text,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
    },
    breed: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.accent,
    },
    details: {
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    detailText: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.regular,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ownerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    ownerImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    ownerName: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.regular,
        flex: 1,
    },
    priceContainer: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    priceText: {
        color: colors.textLight,
        fontSize: typography.fontSize.body,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
    },
    neuteredBadge: {
        position: 'absolute',
        bottom: spacing.sm,
        left: spacing.sm,
        backgroundColor: colors.info,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    neuteredText: {
        color: colors.textLight,
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily.heading,
        fontWeight: typography.fontWeight.bold,
    },
});

export default withSafeComponent(PetListItem);
=======
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import MarkFav from '../MarkFav'

export default function PetListItem({ pet }) {

    if (!pet) return null


    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/pet-details',
                params: pet
            })}
            style={{
                padding: 10,
                marginRight: 15,
                backgroundColor: 'white',
                borderRadius: 15
            }}>
            <View style={{
                position: 'absolute',
                zIndex: 10,
                right: 10,
                top: 10
            }}>
                <MarkFav pet={pet} color={'white'} />
            </View>
            <Image
                source={{ uri: pet?.imageUrl }}
                style={{
                    width: 150,
                    height: 135,
                    borderRadius: 10,
                    resizeMode: 'cover'
                }}
            />
            <Text style={{
                fontFamily: 'Pacifico-Regular',
                fontSize: 12,
                marginTop: 10
            }}>
                {pet?.name}
            </Text>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={{
                    color: 'gray',
                    fontFamily: 'PermanentMarker-Regular',

                }}>{pet?.breed}</Text>
                <Text style={{
                    color: 'Black',
                    fontFamily: 'PermanentMarker-Regular',
                    fontSize: 10,
                    borderRadius: 10,
                    paddingHorizontal: 7,
                    backgroundColor: '#f5d372'
                }}>
                    {pet?.age} Yrs
                </Text>
            </View>
        </TouchableOpacity>
    )
}
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
