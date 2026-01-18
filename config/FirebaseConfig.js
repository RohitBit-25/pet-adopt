import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Environment from "./Environment";

// Your web app's Firebase configuration with fallbacks
const firebaseConfig = {
  apiKey: Environment.FIREBASE_API_KEY,
  authDomain: "pet-adopt-44760.firebaseapp.com",
  projectId: "pet-adopt-44760",
  storageBucket: "pet-adopt-44760.appspot.com",
  messagingSenderId: "594400195120",
  appId: "1:594400195120:web:dc29e437d5ade712f6f3f5",
};

if (__DEV__) {
  console.log("🔥 Firebase Config:", {
    apiKey: firebaseConfig.apiKey ? "✅ Present" : "❌ Missing",
    projectId: firebaseConfig.projectId,
  });
}

let app;
let db;
let auth;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  // Check if auth is already initialized to avoid duplicate initialization
  try {
    auth = getAuth(app);
  } catch (authError) {
    // If getAuth fails, try initializeAuth
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }

  if (__DEV__) {
    console.log("✅ Firebase initialized successfully");
  }
} catch (error) {
  if (__DEV__) {
    console.error("❌ Firebase initialization error:", error);
  }
  // Create a mock db object to prevent crashes
  db = {
    collection: () => ({
      getDocs: () => Promise.resolve({ docs: [] }),
      addDoc: () => Promise.resolve({ id: "mock" }),
    }),
  };
  // Create a mock auth object
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: async () => {
      throw new Error("Mock auth");
    },
    createUserWithEmailAndPassword: async () => {
      throw new Error("Mock auth");
    },
    signOut: async () => {},
    onAuthStateChanged: () => () => {},
  };
}

export { db, auth };
