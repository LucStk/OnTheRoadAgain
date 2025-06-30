import { LngLat} from "maplibre-gl";
import maplibregl from 'maplibre-gl';

export function toGeoDjango([lng, lat]: [number, number]) {
	return {
		type: "Point",
		coordinates: [lng, lat]
	};
}

export function fromGeoDjango(geoDjango: any) {
	return LngLat.convert(geoDjango.coordinates)
}

export class Map extends maplibregl.Map {
	constructor(container: HTMLElement) {
		const options = {
			container,
			style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo',
			center : LngLat.convert([-4.49993133544922, 48.41040274663766]),
			zoom: 13,
		}
		super(options)
	}
	
}