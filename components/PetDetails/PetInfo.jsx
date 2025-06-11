import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import MarkFav from '../MarkFav';
import { MaterialIcons } from '@expo/vector-icons';
import {
    spacing,
    fontSize,
    iconSize,
    borderRadius,
    deviceInfo,
    responsivePadding,
    verticalScale
} from '../../utils/responsive';

export default function PetInfo({ pet }) {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: pet.imageUrl }}
                style={styles.petImage}
            />
            <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.petName}>
                        {pet.name}
                    </Text>
                    <View style={styles.locationContainer}>
                        <MaterialIcons
                            name="location-on"
                            size={deviceInfo.isTablet ? iconSize.lg : iconSize.md}
                            color="#667eea"
                        />
                        <Text style={styles.locationText}>
                            {pet?.address}
                        </Text>
                    </View>
                </View>
                <View style={styles.favoriteContainer}>
                    <MarkFav pet={pet} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    petImage: {
        width: '100%',
        height: deviceInfo.isTablet ? verticalScale(400) : verticalScale(350),
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: responsivePadding.large,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.lg,
    },
    petName: {
        fontFamily: 'Pacifico-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.hero : fontSize.heading,
        color: '#333',
        marginBottom: spacing.sm,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    locationText: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: deviceInfo.isTablet ? fontSize.xl : fontSize.lg,
        color: '#666',
        flex: 1,
    },
    favoriteContainer: {
        marginTop: spacing.xs,
    },
});