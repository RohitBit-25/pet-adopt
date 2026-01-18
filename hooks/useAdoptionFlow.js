import { useState, useRef } from "react";
import { Alert } from "react-native";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";
import { router } from "expo-router";

export const useAdoptionFlow = () => {
  const { user } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const initiateChat = async (pet) => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      Alert.alert(
        "Login Required",
        "Please login to start chatting with the pet owner.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!pet?.email) {
      Alert.alert("Error", "Pet owner information is not available.", [
        { text: "OK" },
      ]);
      return;
    }

    // Check if user is trying to adopt their own pet
    if (user.primaryEmailAddress.emailAddress === pet.email) {
      Alert.alert("Cannot Adopt", "You cannot adopt your own pet!", [
        { text: "OK" },
      ]);
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Start Adoption Process",
      `Are you interested in adopting ${pet.name}? This will start a chat with the owner.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, I'm Interested",
          onPress: () => handleAdoptionProcess(pet),
          style: "default",
        },
      ]
    );
  };

  const handleAdoptionProcess = async (pet) => {
    setIsLoading(true);

    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      const petOwnerEmail = pet.email;
      const docId1 = `${userEmail}_${petOwnerEmail}`;
      const docId2 = `${petOwnerEmail}_${userEmail}`;

      // Check if chat already exists
      const q = query(
        collection(db, "Chat"),
        where("id", "in", [docId1, docId2])
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const chatDoc = querySnapshot.docs[0];
        router.push({
          pathname: "/chat",
          params: { id: chatDoc.id },
        });
        return;
      }

      // Create new chat
      await setDoc(doc(db, "Chat", docId1), {
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
          },
        ],
        userIds: [userEmail, petOwnerEmail],
        createdAt: new Date().toISOString(),
        petInfo: {
          id: pet.id,
          name: pet.name,
          imageUrl: pet.imageUrl,
        },
      });

      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);

      router.push({ pathname: "/chat", params: { id: docId1 } });
      return;
    } catch (error) {
      console.error("Error initiating chat:", error);
      Alert.alert(
        "Error",
        "Failed to start chat. Please check your connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showConfetti,
    initiateChat,
  };
};
