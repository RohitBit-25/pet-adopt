import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";

export const useChat = (chatId, navigation) => {
  const { user } = useFirebaseAuth();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId || !user?.email) {
      Alert.alert("Error", "Chat information is missing.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      return;
    }

    const fetchChatDetails = async () => {
      try {
        const chatDocRef = doc(db, "Chat", chatId);
        const docSnap = await getDoc(chatDocRef);

        if (docSnap.exists()) {
          const chatData = docSnap.data();
          const other = chatData.users?.find((u) => u.email !== user.email);
          if (other) {
            setOtherUser(other);
            navigation.setOptions({ headerTitle: other.name || "Chat" });
          }
        } else {
          Alert.alert("Error", "Chat not found.", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        }
      } catch (error) {
        console.error("Error fetching chat details:", error);
        Alert.alert("Error", "Failed to load chat details.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatDetails();

    const messagesQuery = query(
      collection(db, "Chat", chatId, "Messages"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(),
            user: data.user,
          };
        });
        setMessages(messageData);
      },
      (error) => {
        console.error("Error loading messages:", error);
        Alert.alert("Error", "Failed to load messages.");
      }
    );

    return () => unsubscribe();
  }, [chatId, user, navigation]);

  const onSend = useCallback(
    (newMessages = []) => {
      const message = newMessages[0];
      addDoc(collection(db, "Chat", chatId, "Messages"), {
        ...message,
        createdAt: new Date(),
      }).catch((error) => {
        console.error("Error sending message:", error);
        Alert.alert("Error", "Failed to send message.");
      });
    },
    [chatId]
  );

  return {
    messages,
    otherUser,
    loading,
    onSend,
  };
};
