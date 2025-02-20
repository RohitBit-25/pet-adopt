// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adopt-44760.firebaseapp.com",
  projectId: "pet-adopt-44760",
  storageBucket: "pet-adopt-44760.firebasestorage.app",
  messagingSenderId: "594400195120",
  appId: "1:594400195120:web:dc29e437d5ade712f6f3f5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
