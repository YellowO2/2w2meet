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
			const eventDetails = EventService.finaliseEvent(e);

			e.participants.forEach(async (p) => {
				if (!p.email) return;

				console.log(`[${new Date().toISOString()}] Event ${e.id} Finalised`);

				const response = await sendNotificationEmail({
					to: p.email,
					subject: `[Finalised] ${e.name}(${e.id}) Details`,
					text: `Date: ${eventDetails.startTime.date}\nTime: ${eventDetails.startTime.time}\nMeet at: ${eventDetails.meetupLocation ? eventDetails.meetupLocation.location.name : e.area.name}\nPax: ${eventDetails.pax}\nNot sure how to get there? Use Google Maps:\n${eventDetails.meetupLocationLink}`,
				});

				console.log(response);
			});

			// update flag to avoid repeated trigger
			e.notified = true;
			EventRepository.updateEvent(e.id, e);
		});
	}
}
