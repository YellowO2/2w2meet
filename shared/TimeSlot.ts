export interface TimeSlot {
    id: string;
    date: Date;
    time: string;
    isSelected: boolean;
    participants: string[]; // Array of participant IDs
}
