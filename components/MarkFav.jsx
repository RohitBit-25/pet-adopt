import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Shared from './../Shared/Shared'
import { useUser } from '@clerk/clerk-expo';
import {
    spacing,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo
} from '../utils/responsive';

export default function MarkFav({ pet, color = 'black' }) {
    const { user } = useUser();
    const [favList, setFavList] = useState();
    useEffect(() => {
        user && GetFav();
    }, [user])

    const GetFav = async () => {
        const result = await Shared.GetFavList(user);

        setFavList(result?.favorites ? result?.favorites : [])
    }
    const AddToFav = async () => {
        const favResult = favList;
        favResult.push(pet?.id)

        await Shared.UpdateFav(user, favResult);
        GetFav();
    }

    const removeFromFav = async () => {
        const favResult = favList.filter(item => item != pet.id)
        await Shared.UpdateFav(user, favResult);
        GetFav();
    }
    return (
        <View style={styles.container}>
            {favList?.includes(pet.id) ?
                <Pressable
                    onPress={removeFromFav}
                    style={styles.favoriteButton}
                    android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
                >
                    <Ionicons
                        name="heart"
                        size={deviceInfo.isTablet ? iconSize.xl : iconSize.lg}
                        color="red"
                    />
                </Pressable> :
                <Pressable
                    onPress={() => AddToFav()}
                    style={styles.favoriteButton}
                    android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
                >
                    <Ionicons
                        name="heart-outline"
                        size={deviceInfo.isTablet ? iconSize.xl : iconSize.lg}
                        color={color}
                    />
                </Pressable>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteButton: {
        padding: spacing.sm,
        borderRadius: borderRadius.round,
        backgroundColor: 'rgba(0,0,0,0.3)',
        ...shadow.small,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: deviceInfo.isTablet ? 50 : 44,
        minHeight: deviceInfo.isTablet ? 50 : 44,
    },
});


