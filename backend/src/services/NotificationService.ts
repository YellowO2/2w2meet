import { sendNotificationEmail } from "../utils/NodemailerUtils";
import { EventService } from "../services/EventService";
import { EventRepository } from "../repositories/EventRepository";

export class NotificationService {
	/**
	 * Starts notification service.
	 */
	static trigger(): void {
		setInterval(async () => {
			console.debug(`[${new Date().toISOString()}] System idle, scanning database for expired events.`);
			await this.notifyParticipants();
			console.debug(`[${new Date().toISOString()}]	Done`);
		}, 5000);
	}

	/**
	 * Sends out email to all registered participants, if any, of each event whose
	 * `responseDeadline` has expired, if any. The associated event is updated with
	 * `notified = true` when an email dispatch does take place.
	 */
	static async notifyParticipants(): Promise<void> {
		const expiredEvents = await EventService.getExpiredEvent();
		console.debug(`[${new Date().toISOString()}]	found ${expiredEvents.length} expired events.`);
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
			console.log("");
			console.debug(`[${new Date().toISOString()}]	done notifying participants of ${e.id} and ${e.notified}`);
		});
	}
}
