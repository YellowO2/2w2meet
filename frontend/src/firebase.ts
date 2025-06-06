import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "w2meet-277df.firebaseapp.com",
  projectId: "w2meet-277df",
  storageBucket: "w2meet-277df.firebasestorage.app",
  messagingSenderId: "132316881556",
  appId: "1:132316881556:web:a14da554770434798d4a81",
  measurementId: "G-7Q1HVJ6PTN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
