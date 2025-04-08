// src/repositories/eventRepository.ts
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import type { QueryFieldFilterConstraint } from "firebase/firestore";
import db from "../firestore";
import { Event } from "../../../shared/Event";

const eventCollection = collection(db, "events");

export class EventRepository {
	/**
	 * Trivial wrapper of `EventRepository.updateEvent`. Pushes a new event into the database, with the
	 * specified id.
	 * @param eventId unique string identifier of the new event
	 * @param newEventData Event instance
	 * @returns the id of the new event.
	 */
	static async createEvent(eventId: string, newEventData: Event): Promise<string | null> {
		return (await this.updateEvent(eventId, newEventData)).id;
	}

	/**
	 * Overwrites the specified event with a new value.
	 * @param eventId unique string identifier of the new event
	 * @param newEventData `Event` instance
	 * @returns the updated `Event` object, with changes reflected.
	 */
	static async updateEvent(eventId: string, newEventData: Event): Promise<Event | null> {
		const eventDoc = doc(eventCollection, eventId);

		await setDoc(eventDoc, newEventData, { merge: true });
		return (await getDoc(eventDoc)).data() as Event;
	}

	/**
	 * Removes the specified event from database.
	 * @param eventId unique string identifier of the event
	 * @returns the ID of the event deleted; `null` if the event did not exist.
	 */
	static async deleteEvent(eventId: string): Promise<string | null> {
		const eventDoc = doc(eventCollection, eventId);
		const eventSnapshot = await getDoc(eventDoc);

		if (!eventSnapshot.exists()) return null;

		const deletedId = (eventSnapshot.data() as Event).id;

		await deleteDoc(eventDoc);

		return deletedId;
	}

	/**
	 * Gets an event from the database by their ID.
	 * @param eventId unique string identifier of the event
	 * @returns the `Event` instance if found; `null` otherwise.
	 */
	static async getEventById(eventId: string): Promise<Event | null> {
		const eventDoc = doc(eventCollection, eventId);
		const eventSnapshot = await getDoc(eventDoc);
		return eventSnapshot.exists() ? (eventSnapshot.data() as Event) : null;
	}

	static async getEvents(...w: QueryFieldFilterConstraint[]): Promise<Event[]> {
		const q = query(eventCollection, ...w);
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((d) => d.data() as Event);
	}
}
