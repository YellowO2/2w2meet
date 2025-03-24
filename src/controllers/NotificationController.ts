import type { Event } from "../models/Event";

export class NotificationController {
	async notifyParticipants(_expiredEvents: string) {
		const expiredEvents = JSON.parse(_expiredEvents) as Event[];

		expiredEvents.forEach((e) => {
			e.participants.forEach((p) => {
				if (!p.email) return;
				console.log(`notifying ${p.email}`);
				// notify email
			});

			e.notified = true;
		});
	}
}
