import { createTransport } from "nodemailer";
import secret from "../config/config";

const transporter = createTransport({
	service: "gmail",
	auth: {
		user: "2w2meet.noreply@gmail.com",
		pass: secret.nodemailerPass,
	},
});

// data: { to: string; subject: string; text: string }
export const sendNotificationEmail = async (data: { to: string; subject: string; text: string }) => {
	const { to, subject, text } = data;

	try {
		const result = await transporter.sendMail({
			from: "2w2meet.noreply@gmail.com",
			to: to,
			subject: subject,
			text: text,
		});

		return { result };
	} catch (error) {
		return { error };
	}
};
