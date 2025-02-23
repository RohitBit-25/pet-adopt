import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Shared from '../../Shared/Shared';
import { useUser } from '@clerk/clerk-expo';
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import PetListItem from '../../components/Home/PetListItem';

export default function Favorite() {
    const { user } = useUser();
    const [favIds, setFavIds] = useState([]);
    const [favPetList, setFavPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    // Fetch favorite pet IDs
    useEffect(() => {
        if (user) GetFavPetIds();
    }, [user]);

    const GetFavPetIds = async () => {
        setLoader(true);
        const result = await Shared.GetFavList(user);
        setFavIds(result?.favorites || []);
        setLoader(false);
    };

    // Fetch favorite pet details when `favIds` updates
    useEffect(() => {
        if (favIds.length > 0) {
            GetFavPetList();
        } else {
            setFavPetList([]); // Reset when there are no favorites
        }
    }, [favIds]);

    const GetFavPetList = async () => {
        setLoader(true);
        try {
            const q = query(collection(db, 'Pets'), where('id', 'in', favIds));
            const querySnapshot = await getDocs(q);

            const pets = [];
            querySnapshot.forEach((doc) => {
                pets.push(doc.data());
            });

            setFavPetList(pets);
        } catch (error) {
            console.error("Error fetching favorite pets:", error);
        }
        setLoader(false);
    };

    return (
        <View style={{ padding: 20, marginTop: 20 }}>
            <Text style={{ fontFamily: 'PermanentMarker-Regular', fontSize: 30 }}>Favorite</Text>

            <FlatList
                data={favPetList}
                numColumns={2}
                onRefresh={GetFavPetIds}
                refreshing={loader}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PetListItem pet={item} />
                )}
                ListEmptyComponent={<Text>No favorite pets found.</Text>}
            />
        </View>
    );
}
