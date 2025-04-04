export interface Location {
	name: string;
	address?: string;
	lat: number;
	lng: number;
}

export interface Establishment {
	id?: string;
	location: Location;
	distance: number;
	rating: number;
	category: string[];
	votedBy: Array<string>;
	link: string;
}
