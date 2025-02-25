import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
        });
    }, [navigation]);

    //use to initiate the chat between two users

    const InitiateChat = async () => {
        if (!user || !user.primaryEmailAddress?.emailAddress || !pet?.email) return;

        try {
            const userEmail = user.primaryEmailAddress.emailAddress;
            const petOwnerEmail = pet.email;
            const docId1 = `${userEmail}_${petOwnerEmail}`;
            const docId2 = `${petOwnerEmail}_${userEmail}`;

            const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const chatDoc = querySnapshot.docs[0];
                router.push({
                    pathname: '/chat',
                    params: { id: chatDoc.id },
                });
                return;
            }

            await setDoc(doc(db, 'Chat', docId1), {
                id: docId1,
                users: [
                    {
                        email: userEmail,
                        imageUrl: user.imageUrl,
                        name: user.fullName,
                    },
                    {
                        email: petOwnerEmail,
                        imageUrl: pet.userImage,
                        name: pet.username,
                    }
                ],
                userIds: [userEmail, petOwnerEmail]
            });

            router.push({
                pathname: '/chat',
                params: { id: docId1 },
            });
        } catch (error) {
            console.error('Error initiating chat:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <PetInfo pet={pet} />
                <PetSubInfo pet={pet} />
                <AboutPet pet={pet} />
                <OwnerInfo pet={pet} />
                <View style={{ height: 70 }} />
            </ScrollView>

            {/* Adopt me Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={InitiateChat} style={styles.adoptBtn}>
                    <Text style={styles.adoptBtnText}>Adopt Me</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    adoptBtn: {
        padding: 15,
        backgroundColor: '#f5d372',
    },
    adoptBtnText: {
        textAlign: 'center',
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 20,
    },
    bottomContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
});
