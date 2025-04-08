import { ref } from "vue";
import type { Event } from "../../../shared/Event";
import type { Location } from "../../../shared/Location";

interface EventData {
  name: string;
  dateRange: { start: string; end: string };
  timeRange: { start: number; end: number };
  area: Location;
  responseDeadline: string;
  createdBy?: string | null;
  isPublic?: boolean;
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
      createdBy: eventData.createdBy || null,
      isPublic: eventData.isPublic !== undefined ? eventData.isPublic : true,
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
    const rawResponse = await fetch(
      `http://localhost:3000/api/event/${eventId}`
    );

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
