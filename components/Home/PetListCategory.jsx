import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import Category from './Category'
import { collection, getDocs, query, where } from 'firebase/firestore'
import PetListItem from './PetListItem'
import { db } from '../../config/FirebaseConfig'

export default function PetListCategory() {
    const [petList, setPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    const GetPetList = useCallback(async (category) => {
        setLoader(true);
        try {
            const q = query(collection(db, 'Pets'), where('Category', '==', category))
            const querySnapshot = await getDocs(q)

            // Collect data first, then update state once
            const pets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setPetList(pets)
            setLoader(false)
        } catch (error) {
            console.error("Error fetching pets:", error)
        }
    }, [])

    useEffect(() => {
        GetPetList('Dogs')
    }, [GetPetList])

    return (
        <View>
            <Category category={GetPetList} />
            <FlatList
                data={petList}
                horizontal={true}
                refreshing={loader}
                onRefresh={() => GetPetList('Dogs')}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PetListItem pet={item} />}
                ListEmptyComponent={<Text>No pets found.</Text>}
            />
        </View>
    )
}
