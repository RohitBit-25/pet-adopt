import { View, Text, Image } from 'react-native'
import React from 'react'

import MarkFav from '../MarkFav';


export default function PetInfo({ pet }) {
    return (
        <View>
            <Image
                source={{ uri: pet.imageUrl }}
                style={{
                    width: '100%',
                    height: 350,
                    objectFit: 'cover'
                }}
            />
            <View style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
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
                <MarkFav pet={pet} />
            </View>
        </View>
    )
}