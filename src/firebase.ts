// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCBvqncQosuCdJrnEI7xmHMmDOD83C3yEY",
  authDomain: "task1-93156.firebaseapp.com",
  projectId: "task1-93156",
  storageBucket: "task1-93156.appspot.com",
  messagingSenderId: "65489427452",
  appId: "1:65489427452:web:602c5a35ef2fa45d017079",
  measurementId: "G-78Q7BR2SGV",
  databaseURL:
    "https://task1-93156-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
