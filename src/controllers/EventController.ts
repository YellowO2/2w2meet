import { ref } from "vue";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Event } from "../models/Event";

export class EventController {
  private event = ref<Event | null>(null);

  async createEvent(eventData: {
    name: string;
    dateRange: { start: string; end: string };
    timeRange: { start: number; end: number };
    area: string;
    responseDeadline: string;
  }): Promise<string> {
    // Generate a unique ID for the new event
    const eventId = Math.random().toString(36).substr(2, 6);

    const newEvent: Event = {
      id: eventId,
      name: eventData.name,
      dateRange: eventData.dateRange,
      timeRange: eventData.timeRange,
      area: eventData.area,
      responseDeadline: eventData.responseDeadline,
      meetupLocations: [],
      participants: [],
    };

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
