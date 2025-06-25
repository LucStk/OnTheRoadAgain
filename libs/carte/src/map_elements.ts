import { Marker, LngLatBounds, Map, type LngLatLike} from "maplibre-gl";
import { createApp, h, type Ref } from "vue";
import MyMarkerComponent from "./components/route/RouteMarker.vue";


// Point personnalisé avec composant Vue monté dynamiquement
export class PMarker extends Marker {
	private vueApp: any;

	constructor(coords: LngLatLike, map: Map, onMove? : Function, index = 0) {
		const container = document.createElement("div");

		// Monte dynamiquement le composant Vue dans le conteneur
		const app =createApp({
			render: () => h(MyMarkerComponent, { index })
		})
		app.mount(container);

		super({ element: container, draggable: true });
		this.vueApp = app;

		this.setLngLat(coords).addTo(map);
		if (onMove) {
			this.on("drag", () => onMove(this));
		}
		container.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		console.log('contextmenu sur container');
		this.destroy();
		});
	}

	public destroy() {
		this.remove(); // supprime de la carte
		if (this.vueApp) {
			this.vueApp.unmount(); // démonte le composant Vue proprement
		}
	}
}