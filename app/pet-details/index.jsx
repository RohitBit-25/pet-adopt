<<<<<<< HEAD
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
=======
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
<<<<<<< HEAD
import CommentsSection from '../../components/PetDetails/CommentsSection';
import AnimatedButton from '../../components/Common/AnimatedButton';
import { useAdoptionFlow } from '../../hooks/useAdoptionFlow';
import {
    fontSize,
    borderRadius,
    deviceInfo,
    responsivePadding,
    spacing,
    shadow
} from '../../utils/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import ConfettiOverlay from '../../components/Common/ConfettiOverlay';
import sharePet from '../../utils/shareUtils';
=======
import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation = useNavigation();
<<<<<<< HEAD
    const { isLoading, showConfetti, initiateChat } = useAdoptionFlow();
=======
    const { user } = useUser();
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
        });
    }, [navigation]);

<<<<<<< HEAD
    const handleShare = () => sharePet(pet);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
=======
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
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
                <PetInfo pet={pet} />
                <PetSubInfo pet={pet} />
                <AboutPet pet={pet} />
                <OwnerInfo pet={pet} />
<<<<<<< HEAD
                <CommentsSection petId={pet?.id} />
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Enhanced Adopt Button */}
            <View style={styles.bottomContainer}>
                <AnimatedButton
                    onPress={() => initiateChat(pet)}
                    loading={isLoading}
                    title="Adopt Me"
                    icon="favorite"
                    endIcon="arrow-forward"
                    style={{
                        borderRadius: borderRadius.xl,
                        shadowColor: '#ff6b6b',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.18,
                        shadowRadius: 12,
                        elevation: 8,
                    }}
                    textStyle={{
                        fontFamily: 'PermanentMarker-Regular',
                        fontSize: deviceInfo.isTablet ? fontSize.title : fontSize.xl,
                    }}
                />
            </View>

            {/* Share Button */}
            <View style={styles.shareButton}>
                <Pressable onPress={handleShare} style={{ borderRadius: 20, overflow: 'hidden' }}>
                    <LinearGradient colors={['#ff6b6b', '#667eea']} style={{ borderRadius: 20, padding: 8 }}>
                        <MaterialIcons name="share" size={22} color="white" />
                    </LinearGradient>
                </Pressable>
            </View>

            <ConfettiOverlay visible={showConfetti} />
=======
                <View style={{ height: 70 }} />
            </ScrollView>

            {/* Adopt me Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={InitiateChat} style={styles.adoptBtn}>
                    <Text style={styles.adoptBtnText}>Adopt Me</Text>
                </TouchableOpacity>
            </View>
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
<<<<<<< HEAD
        backgroundColor: '#f8f9fa'
=======
    },
    adoptBtn: {
        padding: 15,
        backgroundColor: '#f5d372',
    },
    adoptBtnText: {
        textAlign: 'center',
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 20,
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
    },
    bottomContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
<<<<<<< HEAD
        paddingHorizontal: responsivePadding.horizontal,
        paddingVertical: spacing.lg,
        paddingBottom: deviceInfo.isTablet ? spacing.lg : spacing.lg + 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e1e5e9',
        ...shadow.large,
        shadowOffset: { width: 0, height: -2 },
    },
    shareButton: {
        position: 'absolute',
        top: 30,
        right: 30,
        zIndex: 10,
=======
>>>>>>> fcc6cfee889dd6e44b875c662480aee43fe8b803
    },
});
