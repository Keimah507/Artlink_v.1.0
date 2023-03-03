// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4u9g_glUgfsf4ASz1qKyXSq2FIiVCzy8",
  authDomain: "nft-marketplace-e6568.firebaseapp.com",
  projectId: "nft-marketplace-e6568",
  storageBucket: "nft-marketplace-e6568.appspot.com",
  messagingSenderId: "300016163915",
  appId: "1:300016163915:web:de8b0c90e408a9e06f01ce",
  measurementId: "G-M0GFXMYKDV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);