
import {Map} from "maplibre-gl"
import {Route} from "./point.js";

export class Map_custom extends Map {
	constructor(routePointsRef) {
		super({
      container: 'map', // container id
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo', // style URL
      center: [-4.49993133544922, 48.41040274663766], // starting position [lng, lat]
      zoom: 13 // starting zoom
		});
		
		this.routes = [];
		this.routePointsRef = routePointsRef; // 🔗 Référence réactive externe
	}

	newRoute() {
		const r = new Route(this, this.routePointsRef);
		this.routes.push(r);
		return r;
	}
}
