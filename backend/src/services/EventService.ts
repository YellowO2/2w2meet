import { where } from "firebase/firestore";
import type { Event } from "../../../shared/Event";
import { EventRepository } from "../repositories/EventRepository";
import { searchPlaces } from "../utils/GoogleUtils";
import { LatLng } from "@googlemaps/google-maps-services-js";
import { Establishment } from "../../../shared/Location";

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
      isPublic:
        eventFormData.isPublic !== undefined ? eventFormData.isPublic : true,
    };

    console.log(newEvent.meetupLocations);

    return await EventRepository.createEvent(eventId, newEvent);
  }

  private static async initMeetupLocations(
    eventFormData: Partial<Event>
  ): Promise<Establishment[]> {
    const latlng = {
      lat: eventFormData.area.lat,
      lng: eventFormData.area.lng,
    } as LatLng;
    return (await searchPlaces(latlng, 500, "cafe", "bus_station")).slice(0, 5);
  }

  static async getExpiredEvent(): Promise<Event[]> {
    return await EventRepository.getEvents(
      where("responseDeadline", "<=", new Date().toISOString()),
      where("notified", "==", false)
    );
  }
}
