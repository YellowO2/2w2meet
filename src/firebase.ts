import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { NotificationController } from "./controllers/NotificationController";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "w2meet-277df.firebaseapp.com",
	projectId: "w2meet-277df",
	storageBucket: "w2meet-277df.firebasestorage.app",
	messagingSenderId: "132316881556",
	appId: "1:132316881556:web:a14da554770434798d4a81",
	measurementId: "G-7Q1HVJ6PTN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const notificationController = new NotificationController();
/*
This function searches for saved events whose deadlines have expired, and informs
NotificationController accordingly.

Originally planned to use Firebase functions, but that required a subscription.
At the time being, we will just use some locally hosted periodic invocation on a 
locally hosted emulation of a schedule .
*/
export const localSchedule = async () => {
	try {
		const response = await fetch("http://127.0.0.1:5001/w2meet-277df/us-central1/findExpiredEvents");
		const expiredEvents = await response.text();

		notificationController.notifyParticipants(expiredEvents);
	} catch (error) {
		console.error("Emulation failed: ", error);
	}
};

export { db };
