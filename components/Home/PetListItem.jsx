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
