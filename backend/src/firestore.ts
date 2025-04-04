import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import secret from "./config/config";

const firebaseConfig = {
	apiKey: secret.firebaseAPIKey,
	authDomain: "w2meet-277df.firebaseapp.com",
	projectId: "w2meet-277df",
	storageBucket: "w2meet-277df.firebasestorage.app",
	messagingSenderId: "132316881556",
	appId: "1:132316881556:web:a14da554770434798d4a81",
	measurementId: "G-7Q1HVJ6PTN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
