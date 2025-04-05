import { sendNotificationEmail } from "../utils/NodemailerUtils";
import { EventService } from "../services/EventService";
import { EventRepository } from "../repositories/EventRepository";

export class NotificationService {
	/**
	 * Starts notification service.
	 */
	static trigger(): void {
		setInterval(async () => {
			await this.notifyParticipants();
		}, 5000);
	}

	/**
	 * Sends out email to all registered participants, if any, of each event whose
	 * `responseDeadline` has expired, if any. The associated event is updated with
	 * `notified = true` when an email dispatch does take place.
	 */
	static async notifyParticipants(): Promise<void> {
		const expiredEvents = await EventService.getExpiredEvent();
		if (!expiredEvents) return;

		expiredEvents.forEach((e) => {
			e.participants.forEach(async (p) => {
				if (!p.email) return;

				const response = await sendNotificationEmail({
					to: p.email,
					subject: `${e.name} Details Finalised`,
					text: `placeholder time; placeholder placeholder; ${e.area.name}`,
				});

				console.log(response);
			});

			// update flag to avoid repeated trigger
			e.notified = true;
			EventRepository.updateEvent(e.id, e);
		});
	}
}
