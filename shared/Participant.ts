export interface Participant {
    id: string;
    name: string;
    email?: string;
    availability: string[]; // Array of TimeSlot IDs
}
