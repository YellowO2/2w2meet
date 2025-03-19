export interface Location {
	name: string;
	lat: number;
	lng: number;
}

export interface Establishment {
	name: string;
	lat: number;
	lng: number;
	distance: number;
	rating: number;
	category: string[];
	votedBy: Array<string>;
	link: string;
}
