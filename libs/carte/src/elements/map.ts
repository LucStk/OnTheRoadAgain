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

export function computeBBox(points: number[][]): number[] {
  const lats = points.map(p => p[1]);
  const lngs = points.map(p => p[0]);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return [minLng, minLat, maxLng, maxLat];
}

export function geoJSONPolygonToBbox(polygon : any) {
  if (!polygon || polygon.type !== "Polygon" || !Array.isArray(polygon.coordinates)) {
    throw new Error("Invalid GeoJSON Polygon");
  }

  // On suppose que polygon.coordinates est un tableau de tableaux, fermé,
  // avec exactement 5 points (premier = dernier)
  const coords = polygon.coordinates[0];
  if (coords.length !== 5) {
    throw new Error("Polygon coordinates must have 5 points (closed rectangle)");
  }

  // Extraire les longitudes et latitudes séparément
  const lngs = coords.map((coord: any[]) => coord[0]);
  const lats = coords.map((coord: any[]) => coord[1]);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  return [minLng, minLat, maxLng, maxLat];
}

export function bboxToGeoJSONPolygon(bbox : number[] | null) {
  if (!bbox) return null
  if (!Array.isArray(bbox) || bbox.length !== 4) {
    throw new Error("bbox must be an array of 4 numbers: [minLng, minLat, maxLng, maxLat]");
  }

  const [minLng, minLat, maxLng, maxLat] = bbox;

  return {
    type: "Polygon",
    coordinates: [[
      [minLng, minLat],
      [minLng, maxLat],
      [maxLng, maxLat],
      [maxLng, minLat],
      [minLng, minLat] // Fermeture du polygone
    ]]
  };
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