import { ref } from "vue";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Event } from "../../../shared/Event";
import type { Location, Establishment } from "../../../shared/Location";

interface EventData {
	name: string;
	dateRange: { start: string; end: string };
	timeRange: { start: number; end: number };
	area: Location;
	responseDeadline: string;
}

export class EventController {
	private event = ref<Event | null>(null);

	async createEvent(eventData: EventData): Promise<string> {
		// Generate a unique ID for the new event
		const eventId = Math.random().toString(36).substr(2, 6);

		const newEvent: Event = {
			id: eventId,
			name: eventData.name,
			dateRange: eventData.dateRange,
			timeRange: eventData.timeRange,
			area: eventData.area,
			responseDeadline: eventData.responseDeadline,
			meetupLocations: await getMeetupLocations(eventData.area),
			participants: [],
			notified: false,
		};

		console.log(newEvent.meetupLocations);

		// Save the new event to Firestore
		const eventDoc = doc(db, "events", eventId);
		await setDoc(eventDoc, newEvent);

		return eventId;
	}

	async fetchEvent(eventId: string) {
		const eventDoc = doc(db, "events", eventId);
		const eventSnapshot = await getDoc(eventDoc);

		if (eventSnapshot.exists()) {
			this.event.value = eventSnapshot.data() as Event;
		} else {
			console.error("Event not found!");
		}
	}

	async saveEvent(updatedEvent: Event) {
		const eventDoc = doc(db, "events", updatedEvent.id);
		await setDoc(eventDoc, updatedEvent);
		console.log("Event saved successfully!");
	}

	getEvent() {
		return this.event;
	}
}

function getMeetupLocations(nearby: Location): Promise<Establishment[]> {
	const service = new google.maps.places.PlacesService(document.createElement("div"));

	return new Promise((resolve) => {
		service.nearbySearch(
			{
				location: { lat: nearby.lat, lng: nearby.lng },
				radius: 300,
				/*
					This API only allows the search of one type at a time
					we could call nearbySearch for each of the types of 
					interest, but the API key owner would probably go bankrupt.
				*/
				type: "cafe",
			},
			(results, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					const places =
						results
							?.map(({ name, geometry, rating, types }) => ({
								name: name || "",
								lat: geometry?.location?.lat() || NaN,
								lng: geometry?.location?.lng() || NaN,
								distance: calculateDistance(
									nearby.lat,
									nearby.lng,
									geometry?.location?.lat() || 0.0,
									geometry?.location?.lng() || 0.0
								),
								rating: rating || 0.0,
								category: types || [],
								votedBy: new Array<string>(),
								link: "",
							}))
							.sort((p, q) => p.distance - q.distance)
							// TODO: Index 0 could be the chosen venue. Should not appear
							// as results. Needed to remove when appropriate.
							.slice(0, 4) || [];

					resolve(places);
				} else {
					console.warn("No places found:", status);
					// default to no available meetup locations.
					resolve([]);
				}
			}
		);
	});
}

/**
 * Calculates the shortest point-to-point distance, in meters, on a spherical surface.
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	return (
		6371000 *
		2 *
		Math.atan2(
			Math.sqrt(
				Math.sin(((lat2 - lat1) * Math.PI) / 180 / 2) ** 2 +
					Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(((lon2 - lon1) * Math.PI) / 180 / 2) ** 2
			),
			Math.sqrt(
				1 -
					Math.sin(((lat2 - lat1) * Math.PI) / 180 / 2) ** 2 -
					Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(((lon2 - lon1) * Math.PI) / 180 / 2) ** 2
			)
		)
	);
}
