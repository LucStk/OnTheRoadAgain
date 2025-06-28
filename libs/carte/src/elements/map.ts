import { LngLat} from "maplibre-gl";

export function toGeoDjango([lng, lat]: [number, number]) {
	return {
		type: "Point",
		coordinates: [lng, lat]
	};
}

export function fromGeoDjango(geoDjango: any) {
	console.log(geoDjango)
	return LngLat.convert(geoDjango.coordinates)
}