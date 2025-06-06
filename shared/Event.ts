import type { Participant } from "./Participant";
import type { TimeSlot } from "./TimeSlot";
import type { Location, Establishment } from "./Location";

export interface Event {
  id: string;
  name: string;
  dateRange: {
    start: string;
    end: string;
  };
  timeRange: {
    start: number;
    end: number;
  };
  area: Location; // this refers to the general area of interest
  meetupLocations: Establishment[]; //idk who thought 'location' was a good name instead of venue but i went with it
  responseDeadline: string;
  participants: Participant[];
  notified: boolean;
  timeSlots?: TimeSlot[];
  createdBy?: string | null; // User ID who created the event
  creatorId?: string; // User ID of the creator
  isPublic?: boolean; // Whether non-registered users can participate
}
