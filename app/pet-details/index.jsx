import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import PetInfo from '../../components/PetDetails/PetInfo';

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: ''
        })
    })
    return (
        <View>
            {/* Pet-Info */}
            <PetInfo pet={pet} />
            {/* Pet Properties */}

            {/* About */}

            {/* Owner details */}

            {/* Adopt me Button */}
        </View>
    )
}