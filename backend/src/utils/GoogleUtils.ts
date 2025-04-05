import { Client, LatLng, PlaceData, PlacesNearbyResponseData, TravelMode, UnitSystem } from "@googlemaps/google-maps-services-js";
import secret from "../config/config";
import { Establishment, Location } from "../../../shared/Location";

const googleMapsClient = new Client();

/**
 * Wrapper function to reduce indentation in `searchPlaces`.
 * @param location query location passed into `searchPlaces`
 * @returns the mapping function required to construct the array `Establishment`s.
 */
const placesResultMapper = (location: LatLng) => {
	return async (place: Partial<PlaceData>) =>
		({
			id: place.place_id,
			location: {
				name: place.name,
				address: place.vicinity,
				lat: place.geometry.location.lat,
				lng: place.geometry.location.lng,
			},
			distance: await getWalkingDistance(location, { lat: place.geometry.location.lat, lng: place.geometry.location.lng }),
			rating: place.rating,
			category: place.types,
			votedBy: [],
			link: "",
		}) as Establishment;
};

/**
 * Searches for all places around `location` within `radius` meters.
 * @param location location of query
 * @param radius maximum distance of results centered at `location`
 * @param types desired categories of results. For possible values see
 * https://developers.google.com/maps/documentation/places/web-service/supported_types.
 * If more than 1 category is specified, the union of the responses from `placesNearby`
 * applied on each of the categories will be taken.
 * @returns all places fitting the criteria.
 */
export const searchPlaces = async (location: LatLng, radius: number, ...types: string[]) => {
	try {
		let responseData: Map<string, Partial<PlaceData>> = new Map();

		for (const t of types) {
			const response = await googleMapsClient.placesNearby({
				params: {
					location: location,
					radius: radius,
					type: t,
					key: secret.googleMapsAPIKey,
				},
			});

			response.data.results.forEach((p) => {
				// Perform iterative set union on results
				responseData.set(p.place_id, p);
			});
		}

		return await Promise.all(Array.from(responseData.values()).map(placesResultMapper(location)));
	} catch (error) {
		throw error;
	}
};

const getWalkingDistance = async (origin: LatLng, destination: LatLng) => {
	try {
		const response = await googleMapsClient.distancematrix({
			params: {
				origins: [origin],
				destinations: [destination],
				mode: TravelMode.walking,
				units: UnitSystem.metric,
				key: secret.googleMapsAPIKey,
			},
		});

		const result = response.data.rows[0].elements[0];
		return result.distance.value;
	} catch (error) {
		throw error;
	}
};
