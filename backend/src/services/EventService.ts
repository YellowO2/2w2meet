import { where } from "firebase/firestore";
import type { Event } from "../../../shared/Event";
import { EventRepository } from "../repositories/EventRepository";
import { searchPlaces } from "../utils/GoogleUtils";
import { LatLng } from "@googlemaps/google-maps-services-js";
import { Establishment } from "../../../shared/Location";
import { max } from "../utils/functools";
import { Participant } from "../../../shared/Participant";

const tw2meetNotificationDateFormat = {
	year: "numeric" as "numeric",
	month: "long" as "long",
	day: "numeric" as "numeric",
};

export class EventService {
	/**
	 * Completes and posts the event information as retrieved from the client-end form.
	 * @param eventFormData client-end form, where `id` and `meetupLocations` are not yet
	 * populated
	 * @returns the assigned ID of the newly created event.
	 */
	static async createEvent(eventFormData: Partial<Event>): Promise<string> {
		// Generate a unique ID for the new event
		const eventId = Math.random().toString(36).substr(2, 6);

		const newEvent: Event = {
			id: eventId,
			name: eventFormData.name,
			dateRange: eventFormData.dateRange,
			timeRange: eventFormData.timeRange,
			area: eventFormData.area,
			responseDeadline: eventFormData.responseDeadline,
			meetupLocations: await this.initMeetupLocations(eventFormData),
			participants: [],
			notified: false,
			createdBy: eventFormData.createdBy || null,
			isPublic: eventFormData.isPublic !== undefined ? eventFormData.isPublic : true,
		};

		return await EventRepository.createEvent(eventId, newEvent);
	}

	private static async initMeetupLocations(eventFormData: Partial<Event>): Promise<Establishment[]> {
		const latlng = { lat: eventFormData.area.lat, lng: eventFormData.area.lng } as LatLng;
		return (await searchPlaces(latlng, 500, "cafe", "bus_station")).slice(0, 5).sort((e1, e2) => e1.distance - e2.distance);
	}

	/**
	 * TEMPORARY wrapper for finalisation logic. Property timeslots was missing in the
	 * Event objects.
	 * @param participants
	 */
	private static getMaxAvailableTimeSlot(participants: Participant[]) {
		const timeslotIdCounts = new Map<string, number>();

		for (const participant of participants) {
			for (const timeslotId of participant.availability) {
				timeslotIdCounts.set(timeslotId, (timeslotIdCounts.get(timeslotId) || 0) + 1);
			}
		}

		const maxTimeslotId = (max(timeslotIdCounts.entries(), (e) => e[1]) || "")[0];

		if (!maxTimeslotId) return { date: "", time: "" };

		return {
			date: new Date(maxTimeslotId.slice(0, maxTimeslotId.indexOf("Z"))).toLocaleDateString("en-GB", tw2meetNotificationDateFormat),
			time: maxTimeslotId.split("Z")[1].slice(1, 6),
		};
	}

	static finaliseEvent(event: Event) {
		const startTime = this.getMaxAvailableTimeSlot(event.participants);
		const meetupLocation = max(event.meetupLocations, (m) => m.votedBy.length);
		const meetupLocationLink = meetupLocation?.link || `http://maps.google.com/?ll=${event.area.lat},${event.area.lng}`;
		const pax = event.participants.length;

		return { startTime, meetupLocation, meetupLocationLink, pax };
	}

	static async getExpiredEvent(): Promise<Event[]> {
		return await EventRepository.getEvents(where("responseDeadline", "<=", new Date().toISOString()), where("notified", "==", false));
	}
}
