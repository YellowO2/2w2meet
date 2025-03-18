import type { Participant } from "./Participant";
import type { TimeSlot } from "./TimeSlot";

export interface Event {
    id: string;
    name: string;
    dateRange: {
        start: Date;
        end: Date;
    };
    timeRange: {
        start: string;
        end: string;
    };
    venue?: Location;
    responseDeadline: Date;
    participants?: Participant[];
    timeSlots?: TimeSlot[];
}
