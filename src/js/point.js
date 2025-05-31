import { Marker } from "maplibre-gl";

export class Point extends Marker {
	constructor(coords, map, onMove) {
		super({ draggable: true });
		this.setLngLat(coords).addTo(map);

		if (onMove) {
			this.on('drag', () => {
				onMove(this); // Notifie le parent (Route) que ce point a bougé
			});
		}
	}

	getCoords() {
		return this.getLngLat().toArray();
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
		});
		this.markers.push(marker);
		this.updatePointsRef();
	}

	updatePointsRef() {
		this.pointsRef.value = this.markers.map(m => m.getLngLat().toArray());
	}
}
