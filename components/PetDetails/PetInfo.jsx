import { View, Text, Image } from 'react-native'
import React from 'react'

export default function PetInfo({ pet }) {
    return (
        <View>
            <Image
                source={{ uri: pet.imageUrl }}
                style={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover'
                }}
            />
            <View style={{
                padding: 20
            }}>
                <View>
                    <Text style={{
                        fontFamily: 'Pacifico-Regular',
                        fontSize: 30
                    }}>
                        {pet.name}


                    </Text>
                    <Text style={{
                        fontFamily: 'PermanentMarker-Regular',
                        fontSize: 20,
                        color: 'gray'
                    }}>
                        {pet?.address}
                    </Text>
                </View>

            </View>
        </View>
    )
}