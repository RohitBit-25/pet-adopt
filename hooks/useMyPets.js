import { useState, useCallback } from "react";
import { Alert } from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";
import { useFocusEffect } from "@react-navigation/native";

export const useMyPets = () => {
  const { user } = useFirebaseAuth();
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyPets = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userEmail = user.primaryEmailAddress.emailAddress;

      const q = query(collection(db, "Pets"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      const pets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyPets(pets);
    } catch (error) {
      console.error("Error fetching my pets:", error);
      Alert.alert("Error", "Failed to load your pets. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchMyPets();
    }, [fetchMyPets])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyPets();
  }, [fetchMyPets]);

  const handleDeletePet = useCallback((petId, petName) => {
    Alert.alert(
      "Delete Pet",
      `Are you sure you want to remove ${petName} from your listings?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deletePet(petId),
        },
      ]
    );
  }, []);

  const deletePet = useCallback(async (petId) => {
    try {
      await deleteDoc(doc(db, "Pets", petId));
      setMyPets((prev) => prev.filter((pet) => pet.id !== petId));
      Alert.alert("Success", "Pet removed successfully!");
    } catch (error) {
      console.error("Error deleting pet:", error);
      Alert.alert("Error", "Failed to delete pet. Please try again.");
    }
  }, []);

  return {
    myPets,
    loading,
    refreshing,
    handleRefresh,
    handleDeletePet,
  };
};
