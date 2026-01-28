// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1st6ypjo_S0U6bpHz2rn9mVtt4_4nLKA",
  authDomain: "studio-4660182389-495ca.firebaseapp.com",
  projectId: "studio-4660182389-495ca",
  storageBucket: "studio-4660182389-495ca.firebasestorage.app",
  messagingSenderId: "989248000033",
  appId: "1:989248000033:web:22d60c3b406caa7bf61360"
};


// Initialize Firebase
let firebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { firebaseApp, auth, firestore };
