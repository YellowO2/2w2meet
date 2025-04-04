import { config } from "dotenv";

config();

/* Provides a typed interface for accessing secrets */
interface Config {
	firebaseAPIKey: string;
	googleMapsAPIKey: string;
	nodemailerPass: string;
}

const secret: Config = {
	firebaseAPIKey: process.env.FIREBASE_API_KEY || "",
	googleMapsAPIKey: process.env.GOOGLE_MAPS_API_KEY || "",
	nodemailerPass: process.env.SERVICE_EMAIL_PASS || "",
};

export default secret;
