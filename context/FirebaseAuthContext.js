import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/FirebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const FirebaseAuthContext = createContext();

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        await fetchUserRole(firebaseUser.uid);
      } else {
        setUserRole("user");
      }
    });
    return unsubscribe;
  }, []);

  // Fetch user role from Firestore
  const fetchUserRole = async (uid) => {
    try {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "Users", uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role || "user");
      } else {
        setUserRole("user");
      }
    } catch (e) {
      setUserRole("user");
    }
  };

  // Email/password login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      await sendEmailVerification(result.user);
      // Set user role in Firestore
      const db = getFirestore();
      await setDoc(doc(db, "Users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName || "",
        role: "user",
        createdAt: new Date().toISOString(),
      });
      setUserRole("user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password reset
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In (Web and Native)
  const googleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      if (
        Constants.appOwnership === "expo" ||
        Constants.appOwnership === "standalone"
      ) {
        // Native/Expo: Use AuthSession
        const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
        const discovery = {
          authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
          tokenEndpoint: "https://oauth2.googleapis.com/token",
          revocationEndpoint: "https://oauth2.googleapis.com/revoke",
        };
        const clientId =
          "455778011785-9prfn4e44a33oo3q4d7heouc3l67as9j.apps.googleusercontent.com"; // TODO: Replace with your real client ID
        const response = await AuthSession.startAsync({
          authUrl:
            `${discovery.authorizationEndpoint}?client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=token&scope=profile email`,
        });
        if (response.type === "success") {
          const { access_token } = response.params;
          const credential = GoogleAuthProvider.credential(null, access_token);
          await signInWithCredential(auth, credential);
        } else {
          throw new Error("Google sign-in cancelled");
        }
      } else {
        // Web: Use signInWithPopup
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send email verification (exposed)
  const sendVerification = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      setLoading(true);
      setError(null);
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper: is email verified
  const isEmailVerified = user?.emailVerified ?? false;

  // Update display name
  const updateProfileInfo = async (displayName) => {
    setLoading(true);
    setError(null);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        setUser({ ...auth.currentUser, displayName });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update avatar (photoURL)
  const updateAvatar = async (uri) => {
    setLoading(true);
    setError(null);
    try {
      if (auth.currentUser && uri) {
        const storage = getStorage();
        const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        const response = await fetch(uri);
        const blob = await response.blob();
        await uploadBytes(avatarRef, blob);
        const photoURL = await getDownloadURL(avatarRef);
        await updateProfile(auth.currentUser, { photoURL });
        setUser({ ...auth.currentUser, photoURL });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        googleSignIn,
        sendVerification,
        isEmailVerified,
        updateProfileInfo,
        updateAvatar,
        userRole,
        refreshUserRole: fetchUserRole,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}
