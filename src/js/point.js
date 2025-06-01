import { Marker } from "maplibre-gl";
import { createApp, h } from "vue";
import MyMarkerComponent from "@/components/route/marker.vue";




export class Point extends Marker {
	constructor(coords, map, onMove, index=0) {
		// Crée un élément DOM qui va contenir le composant Vue
		const container = document.createElement("div");

		// Monte dynamiquement le composant Vue dans ce conteneur
		const app = createApp({
			render: () => h(MyMarkerComponent, { index })
		});
		app.mount(container);

		// Utilise le conteneur comme élément du marker
		super({ element: container, draggable: true });

		this.setLngLat(coords).addTo(map);

		if (onMove) {
			this.on("drag", () => onMove(this));
		}
	}
}

export class Route {
	constructor(map, pointsRef) {
		this.map = map;
		this.pointsRef = pointsRef;
		this.markers = [];

		map.addSource('route-source', {
			type: 'geojson',
			data: {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: []
				}
			}
		});

		map.addLayer({
			id: 'route-line',
			type: 'line',
			source: 'route-source',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': '#FF0000',
				'line-width': 4
			}
		});
	}

	addPoint(coord) {
		const marker = new Point(coord, this.map, () => {
			this.updatePointsRef();
			},this.markers.length
		);
		this.markers.push(marker);
		this.updatePointsRef();
	}

	updatePointsRef() {
		this.pointsRef.value = this.markers.map(m => m.getLngLat().toArray());
	}
}
