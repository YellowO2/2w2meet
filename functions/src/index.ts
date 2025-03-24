/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { query, where, getDocs, collection, getFirestore } from "firebase/firestore";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase/app";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: "w2meet-277df.firebaseapp.com",
	projectId: "w2meet-277df",
	storageBucket: "w2meet-277df.firebasestorage.app",
	messagingSenderId: "132316881556",
	appId: "1:132316881556:web:a14da554770434798d4a81",
	measurementId: "G-7Q1HVJ6PTN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const findExpiredEvents = onRequest(async (_, response) => {
	logger.info("Hello logs!", { structuredData: true });

	const now = new Date().toISOString();

	const q = query(collection(db, "events"), where("responseDeadline", "<=", now), where("notified", "==", false));

	const querySnapshot = await getDocs(q);

	response.send(querySnapshot.docs.map((doc) => doc.data()));
});
