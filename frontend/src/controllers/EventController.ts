import { ref } from "vue";
import type { Event } from "../models/Event";

export class EventController {
  private event = ref<Event | null>(null);

  async fetchEvent(eventId: string) {
    // Simulate fetching event data from the backend
    // Replace this with an actual API call
    this.event.value = {
      id: eventId,
      name: "Sample Event",
      area: "50 Nanyang Ave, Singapore 639798",
      responseDeadline: "2025-03-24T16:00:00.000Z",
      dateRange: {
        start: "2025-03-09T16:00:00.000Z",
        end: "2025-03-12T16:00:00.000Z",
      },
      timeRange: {
        start: 9,
        end: 17,
      },
      meetupLocations: [
        {
          name: "Starbucks",
          distance: "0.5 km",
          rating: "4.5 stars",
          category: "Cafe",
          votedBy: ["Person A"],
          link: "https://maps.google.com",
        },
        {
          name: "Moonbucks",
          distance: "0.8 km",
          rating: "4.2 stars",
          category: "Cafe",
          votedBy: ["Person A"],
          link: "https://maps.google.com",
        },
        {
          name: "Uranusbucks",
          distance: "0.1 km",
          rating: "4.2 stars",
          category: "Cafe",
          votedBy: ["Person B"],
          link: "https://maps.google.com",
        },
      ],
      participants: [
        {
          id: "1",
          name: "Person A",
          availability: [
            "2025-03-09T16:00:00.000Z-9:00",
            "2025-03-09T16:00:00.000Z-9:30",
          ],
        },
        {
          id: "2",
          name: "Person B",
          availability: [
            "2025-03-09T16:00:00.000Z-9:00",
            "2025-03-10T16:00:00.000Z-14:00",
          ],
        },
      ],
    };
  }

  async saveEvent(updatedEvent: Event) {
    // Simulate saving event data to the backend
    // Replace this with an actual API call
    console.log("Saving event to backend:", updatedEvent);
    this.event.value = updatedEvent;
  }

  getEvent() {
    return this.event;
  }
}
