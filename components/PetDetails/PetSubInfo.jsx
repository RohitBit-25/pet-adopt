import { View, Text, Image } from 'react-native'
import React from 'react'
import PetSubInfoCard from './PetSubInfoCard'

export default function PetSubInfo({ pet }) {
    return (
        <View style={{
            paddingHorizontal: 20
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <PetSubInfoCard
                    icon={require('./../../assets/images/calendar.png')}
                    title={"Age"}
                    value={pet?.age + " Years"}
                />
                <PetSubInfoCard
                    icon={require('./../../assets/images/bone.png')}
                    title={"Breed"}
                    value={pet?.breed}
                />

            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <PetSubInfoCard
                    icon={require('./../../assets/images/gender.png')}
                    title={"Sex"}
                    value={pet?.sex}
                />
                <PetSubInfoCard
                    icon={require('./../../assets/images/weight.png')}
                    title={"Weight"}
                    value={pet?.weight + "Kg"}
                />
<<<<<<< HEAD
                <PetSubInfoCard
                    icon={require('./../../assets/images/neutered.png')}
                    title={"Neutered/Spayed"}
                    value={pet?.isNeutered ? "Yes" : "No"}
                />
=======
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803

            </View>

        </View>
    )
}