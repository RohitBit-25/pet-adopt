import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import MarkFav from '../MarkFav'
import {
    spacing,
    fontSize,
    borderRadius,
    shadow,
    deviceInfo,
    components,
    SCREEN_WIDTH
} from '../../utils/responsive';

export default function PetListItem({ pet }) {
    if (!pet) return null;

    const cardWidth = deviceInfo.isTablet
        ? (SCREEN_WIDTH - (spacing.lg * 4)) / 3
        : (SCREEN_WIDTH - (spacing.lg * 3)) / 2;

    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/pet-details',
                params: pet
            })}
            style={[styles.container, { width: cardWidth }]}
            activeOpacity={0.8}
        >
            <View style={styles.favoriteContainer}>
                <MarkFav pet={pet} color={'white'} />
            </View>

            <Image
                source={{ uri: pet?.imageUrl }}
                style={[styles.petImage, { width: cardWidth - (spacing.lg * 2) }]}
            />

            <View style={styles.contentContainer}>
                <Text style={styles.petName} numberOfLines={1}>
                    {pet?.name}
                </Text>

                <View style={styles.detailsContainer}>
                    <Text style={styles.breedText} numberOfLines={1}>
                        {pet?.breed}
                    </Text>
                    <View style={styles.ageBadge}>
                        <Text style={styles.ageText}>
                            {pet?.age} Yrs
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginRight: spacing.md,
        marginBottom: spacing.md,
        ...shadow.medium,
        position: 'relative',
    },
    favoriteContainer: {
        position: 'absolute',
        zIndex: 10,
        right: spacing.md,
        top: spacing.md,
    },
    petImage: {
        height: deviceInfo.isTablet ? 160 : 135,
        borderRadius: borderRadius.md,
        resizeMode: 'cover',
        marginBottom: spacing.md,
    },
    contentContainer: {
        flex: 1,
    },
    petName: {
        fontFamily: 'Pacifico-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.lg : fontSize.md,
        color: '#333',
        marginBottom: spacing.sm,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    breedText: {
        color: '#666',
        fontFamily: 'PermanentMarker-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.md : fontSize.sm,
        flex: 1,
        marginRight: spacing.sm,
    },
    ageBadge: {
        backgroundColor: '#f5d372',
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs / 2,
    },
    ageText: {
        color: 'black',
        fontFamily: 'PermanentMarker-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.sm : fontSize.xs,
        fontWeight: 'bold',
    },
});
