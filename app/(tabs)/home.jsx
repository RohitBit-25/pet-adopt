import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import PetListCategory from '../../components/Home/PetListCategory'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router'

export default function Home() {
    return (
        <View style={{
            padding: 20,
            marginTop: 20
        }}>
            {/* Header */}
            <Header />
            {/* Slider */}
            <Slider />
            {/* Pet List + Category */}

            <PetListCategory />

            {/* Add new pet Options */}
            <Link
                href={'/add-new-pet'}
                style={styles.addNewPetContainer} >
                <MaterialIcons name="pets" size={24} color="black" />
                <Text style={{
                    fontFamily: 'PermanentMarker-Regular',
                    fontSize: 18,
                    color: 'black'

                }}>Add New Pet</Text>
            </Link>
        </View >
    )
}

const styles = StyleSheet.create({
    addNewPetContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        padding: 10,
        textAlign: 'center',
        marginTop: 10,
        backgroundColor: '#f5d372',
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'dashed',
        justifyContent: 'center'

    }
})