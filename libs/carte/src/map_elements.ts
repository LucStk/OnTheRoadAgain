import { Marker, LngLatBounds, Map, type LngLatLike} from "maplibre-gl";
import { createApp, h, type Ref } from "vue";
import MyMarkerComponent from "./components/route/RouteMarker.vue";


export class Map_custom extends Map {
  routes: Route[];
  routePointsRef: Ref<any[]> | undefined;
  points: Point[];

  constructor(routePointsRef?: Ref<any[]>) {
    super({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo',
      center: [-4.49993133544922, 48.41040274663766],
      zoom: 13,
    });
    this.routes = [];
    this.points = [];
    this.routePointsRef = routePointsRef;
  }
  addPoint(coord: LngLatLike) {
    const marker = new Point(coord, this, () => {this.local_save});
    this.points.push(marker);
    this.local_save();
  }
  newRoute() {
	if (this.routePointsRef) {
		const r = new Route(this, this.routePointsRef);
		this.routes.push(r);
		return r;
	}
  }
  local_save(){
    const simplifiedPoints = this.points.map(p => ({
      lngLat: p.getLngLat(), // ou p.coord si tu stockes ça directement
    }));
    localStorage.setItem('points', JSON.stringify(simplifiedPoints));
  }

  local_load(){
    const points = localStorage.getItem('points');
    if (points) {
      const parsed = JSON.parse(points);
      parsed.forEach((p: { lngLat: LngLatLike }) => {
        this.addPoint(p.lngLat);
      });
    }
  }
}


// Point personnalisé avec composant Vue monté dynamiquement
export class Point extends Marker {
	constructor(coords: LngLatLike, map: Map, onMove? : Function, index = 0) {
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
	map: any;
	selectedSegmentIndex: any;
	pointsRef: Ref<LngLatLike[]>;
	markers: Point[];
	bounds: LngLatBounds;
	constructor(map: any, pointsRef: Ref<any[], any[]>) {
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
		this.map.on('click', 'route-line', (e: { features: { properties: { segmentIndex: any; }; }[]; }) => {
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
	addPoint(coord: LngLatLike) {
		const marker = new Point(coord, this.map, () => this.updateRoute(), this.markers.length);
		this.markers.push(marker);
		this.updateRoute();
		this.bounds.extend(marker.getLngLat());

		this.map.fitBounds(this.bounds, {
			padding: {
			top: 100,
			bottom: 350, // ← adapte à la hauteur de ta fenêtre d’info
			left: 100,
			right: 100
			},
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
