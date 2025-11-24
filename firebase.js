import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDDJfaTwMaRjKf6XzcLXV4n9tpQo8I-640",
  authDomain: "drivo-36ada.firebaseapp.com",
  projectId: "drivo-36ada",
  storageBucket: "drivo-36ada.firebasestorage.app",
  messagingSenderId: "544558033330",
  appId: "1:544558033330:web:402e50408472ddcfe2dcab",
  measurementId: "G-QCY98S62J3"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };