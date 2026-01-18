import { useEffect } from "react";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";
import * as Notifications from "expo-notifications";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export const useNotificationSetup = () => {
  const { user } = useFirebaseAuth();

  useEffect(() => {
    async function setupNotifications() {
      if (!user) return;
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          console.log("Notification permissions not granted");
          return;
        }
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;
        // Store token in Firestore
        const db = getFirestore();
        await setDoc(doc(db, "UserPushTokens", user.uid), {
          uid: user.uid,
          email: user.email,
          token,
          updatedAt: new Date().toISOString(),
        });
        console.log("Push token saved:", token);
      } catch (e) {
        console.error("Error saving push token:", e);
      }
    }
    setupNotifications();
  }, [user]);
};
