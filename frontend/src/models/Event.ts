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
}
