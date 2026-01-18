<<<<<<< HEAD
import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Shared from '../Shared/Shared'
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import {
    spacing,
    iconSize,
    borderRadius,
    shadow,
    deviceInfo
} from '../utils/responsive';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function MarkFav({ pet, color = '#ff6b6b' }) {
    const { user } = useFirebaseAuth();
    const [favList, setFavList] = useState();
    const [isAnimating, setIsAnimating] = useState(false);
    const lottieRef = useRef();

=======
import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Shared from './../Shared/Shared'
import { useUser } from '@clerk/clerk-expo';

export default function MarkFav({ pet, color = 'black' }) {
    const { user } = useUser();
    const [favList, setFavList] = useState();
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
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
<<<<<<< HEAD

    const handleToggleFav = async () => {
        if (favList?.includes(pet.id)) {
            removeFromFav();
        } else {
            AddToFav();
        }
        if (!favList?.includes(pet.id)) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1200);
        }
    }

    return (
        <View style={styles.container}>
            <Pressable
                onPress={handleToggleFav}
                style={styles.favoriteButton}
                android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
            >
                <View style={{ position: 'relative', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
                    {isAnimating && (
                        <LottieView
                            ref={lottieRef}
                            source={require('../assets/lottie/heart-burst.json')}
                            autoPlay
                            loop={false}
                            style={{ position: 'absolute', width: 48, height: 48, left: -8, top: -8, zIndex: 2 }}
                        />
                    )}
                    <MaterialIcons
                        name={favList?.includes(pet.id) ? 'favorite' : 'favorite-border'}
                        size={28}
                        color={color}
                        style={{ zIndex: 3 }}
                    />
                </View>
            </Pressable>
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


=======
    return (
        <View>
            {favList?.includes(pet.id) ?
                <Pressable onPress={removeFromFav}>

                    <Ionicons name="heart" size={30} color="red" />
                </Pressable> :
                <Pressable onPress={() => AddToFav()}>

                    <Ionicons name="heart-outline" size={30} color={color} />
                </Pressable>}
        </View>
    )
}
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
