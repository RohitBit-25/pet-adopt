import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";

const GetFavList = async (user) => {
    if (!user?.primaryEmailAddress?.emailAddress) return { favorites: [] };

    const docRef = doc(db, 'UserFavPet', user?.primaryEmailAddress?.emailAddress);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            await setDoc(docRef, {
                email: user?.primaryEmailAddress?.emailAddress,
                favorites: []
            });
            return { favorites: [] }; // Ensure the caller gets a valid response
        }
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return { favorites: [] }; // Fail-safe
    }
};

const UpdateFav = async (user, favorites) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const docRef = doc(db, 'UserFavPet', user?.primaryEmailAddress?.emailAddress);

    try {
        await updateDoc(docRef, { favorites });
    } catch (error) {
        console.error("Error updating favorites:", error);
    }
};

export default {
    GetFavList,
    UpdateFav
};
