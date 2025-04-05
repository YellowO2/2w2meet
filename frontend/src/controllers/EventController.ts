import { ref } from "vue";
import type { Event } from "../../../shared/Event";
import type { Location } from "../../../shared/Location";

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
		const newEvent: Partial<Event> = {
			name: eventData.name,
			dateRange: eventData.dateRange,
			timeRange: eventData.timeRange,
			area: eventData.area,
			responseDeadline: eventData.responseDeadline,
		};

		// Does not look maintainable. Will change the way requests are made.
		// Perhaps the whole project structure should be changed.
		const rawResponse = await fetch("http://localhost:3000/api/event", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newEvent),
		});

		const response = await rawResponse.json();

		return response.id;
	}

	async fetchEvent(eventId: string) {
		const rawResponse = await fetch(`http://localhost:3000/api/event/${eventId}`);

		const response = await rawResponse.json();

		try {
			this.event.value = response as Event;
		} catch (e) {
			console.error("Event not found!");
		}
	}

	async saveEvent(updatedEvent: Event) {
		await fetch(`http://localhost:3000/api/event/${updatedEvent.id}`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedEvent),
		});
	}

	getEvent() {
		return this.event;
	}
}

// function getMeetupLocations(nearby: Location): Promise<Establishment[]> {
// 	const service = new google.maps.places.PlacesService(document.createElement("div"));

// 	return new Promise((resolve) => {
// 		service.nearbySearch(
// 			{
// 				location: { lat: nearby.lat, lng: nearby.lng },
// 				radius: 300,
// 				/*
// 					This API only allows the search of one type at a time
// 					we could call nearbySearch for each of the types of
// 					interest, but the API key owner would probably go bankrupt.
// 				*/
// 				type: "cafe",
// 			},
// 			(results, status) => {
// 				if (status === google.maps.places.PlacesServiceStatus.OK) {
// 					const places =
// 						results
// 							?.map(({ name, geometry, rating, types }) => ({
// 								name: name || "",
// 								lat: geometry?.location?.lat() || NaN,
// 								lng: geometry?.location?.lng() || NaN,
// 								distance: calculateDistance(
// 									nearby.lat,
// 									nearby.lng,
// 									geometry?.location?.lat() || 0.0,
// 									geometry?.location?.lng() || 0.0
// 								),
// 								rating: rating || 0.0,
// 								category: types || [],
// 								votedBy: new Array<string>(),
// 								link: "",
// 							}))
// 							.sort((p, q) => p.distance - q.distance)
// 							// TODO: Index 0 could be the chosen venue. Should not appear
// 							// as results. Needed to remove when appropriate.
// 							.slice(0, 4) || [];

// 					resolve(places);
// 				} else {
// 					console.warn("No places found:", status);
// 					// default to no available meetup locations.
// 					resolve([]);
// 				}
// 			}
// 		);
// 	});
// }

// /**
//  * Calculates the shortest point-to-point distance, in meters, on a spherical surface.
//  * @param lat1
//  * @param lon1
//  * @param lat2
//  * @param lon2
//  * @returns
//  */
// function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
// 	return (
// 		6371000 *
// 		2 *
// 		Math.atan2(
// 			Math.sqrt(
// 				Math.sin(((lat2 - lat1) * Math.PI) / 180 / 2) ** 2 +
// 					Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(((lon2 - lon1) * Math.PI) / 180 / 2) ** 2
// 			),
// 			Math.sqrt(
// 				1 -
// 					Math.sin(((lat2 - lat1) * Math.PI) / 180 / 2) ** 2 -
// 					Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(((lon2 - lon1) * Math.PI) / 180 / 2) ** 2
// 			)
// 		)
// 	);
// }
