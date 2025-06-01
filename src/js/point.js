import { Marker, LngLatBounds} from "maplibre-gl";
import { createApp, h } from "vue";
import MyMarkerComponent from "@/components/route/marker.vue";

// Point personnalisé avec composant Vue monté dynamiquement
export class Point extends Marker {
	constructor(coords, map, onMove, index = 0) {
		const container = document.createElement("div");

		// Monte dynamiquement le composant Vue dans le conteneur
		createApp({
			render: () => h(MyMarkerComponent, { index })
		}).mount(container);

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
		this.selectedSegmentIndex = null;

		this._initRouteSourceAndLayer();
		this._setupMapEvents();
		this.updateRoute();
		this.bounds = new LngLatBounds();
	}

	// Initialisation de la source GeoJSON et du calque
	_initRouteSourceAndLayer() {
		this.map.addSource('route-source', {
			type: 'geojson',
			data: { type: 'FeatureCollection', features: [] }
		});

		this.map.addLayer({
			id: 'route-line',
			type: 'line',
			source: 'route-source',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': [
					'case',
					['==', ['get', 'isSelected'], true], '#0000FF', // bleu si sélectionné
					'#FF0000' // rouge sinon
				],
				'line-width': 4
			}
		});
	}

	// Événements liés à la carte (clic, survol)
	_setupMapEvents() {
		this.map.on('click', 'route-line', (e) => {
			const segmentIndex = e.features[0].properties.segmentIndex;
			this.selectedSegmentIndex = segmentIndex;
			this.updateRoute();
		});

		this.map.on('mouseenter', 'route-line', () => {
			this.map.getCanvas().style.cursor = 'pointer';
		});

		this.map.on('mouseleave', 'route-line', () => {
			this.map.getCanvas().style.cursor = '';
		});
	}

	// Ajoute un point (marqueur) à la route
	addPoint(coord) {
		const marker = new Point(coord, this.map, () => this.updateRoute(), this.markers.length);
		this.markers.push(marker);
		this.updateRoute();
		this.bounds.extend(marker.getLngLat());
		this.map.fitBounds(this.bounds, {
			padding: 50,     // marge autour
			animate: true,   // animation douce
			duration: 1000   // en ms
		});
	}

	// Met à jour les segments de la route et le style de sélection
	updateRoute() {
		console.log("updateroute")
		const segments = this.markers.slice(0, -1).map((marker, i) => {
			const start = marker.getLngLat().toArray();
			const end = this.markers[i + 1].getLngLat().toArray();

			return {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: [start, end]
				},
				properties: {
					segmentIndex: i,
					isSelected: i === this.selectedSegmentIndex
				}
			};
		});

		const source = this.map.getSource('route-source');
		if (source) {
			source.setData({
				type: 'FeatureCollection',
				features: segments
			});
		}
	}
}
