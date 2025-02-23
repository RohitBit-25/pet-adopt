import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'

export default function AboutPet({ pet }) {
    const [readMore, setReadMore] = useState(true);
    return (
        <View Style={{
            padding: 20
        }}>
            <Text style={{
                fontFamily: 'PermanentMarker-Regular',
                fontSize: 20
            }}>AboutPet {pet?.name}</Text>
            <Text numberOfLines={readMore ? 3 : 20} style={{
                fontFamily: 'PermanentMarker-Regular',
                fontSize: 12
            }}>{pet.about} </Text>
            {readMore && <Pressable onPress={() => setReadMore(false)}><Text style={{
                fontFamily: 'PermanentMarker-Regular',
                fontSize: 12,
                color: 'blue'
            }}>Read More</Text></Pressable>}
        </View>
    )
}