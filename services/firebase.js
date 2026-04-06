import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCDxTu_2sK2VFObrNLUICrddAi-hR67Tcs",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "vantyrn-e20f0.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "vantyrn-e20f0",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "vantyrn-e20f0.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "889299912788",
  appId: process.env.FIREBASE_APP_ID || "1:889299912788:web:f2b9726779152d917445c1"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with Persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };
