import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSy0OcmYN00-gQ0XmnxdTb8fYIo5jx7fQU",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "deepweay-9f443.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "deepweay-9f443",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "deepweay-9f443.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "555196362294",
  appId: process.env.FIREBASE_APP_ID || "1:555196362294:web:55d01d468c5821f9cd7297"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export { auth, app };
