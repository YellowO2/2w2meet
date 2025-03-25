import type { Event } from "../models/Event";
// import { sendNotificationEmail } from "../nodemailerInit";
import { EventController } from "./EventController";

const eventController = new EventController();

export class NotificationController {
	async notifyParticipants(_expiredEvents: string) {
		const expiredEvents = JSON.parse(_expiredEvents) as Event[];

		expiredEvents.forEach((e) => {
			e.participants.forEach(async (p) => {
				if (!p.email) return;
				const response = await fetch("http://127.0.0.1:5001/w2meet-277df/us-central1/triggerNotification", {
					method: "POST",
					body: JSON.stringify({
						to: p.email,
						subject: `${e.name} Details Finalised`,
						text: `placeholder time; placeholder placeholder; ${e.area.name}`,
					}),
				});
				console.log(await response.json());
				// notify email

				e.notified = true;
				// write back notified status
				eventController.saveEvent(e);
			});
		});
	}
}
