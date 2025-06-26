import { Marker, Map, type LngLatLike} from "maplibre-gl";
import { createApp, h} from "vue";
import MyPinComponent from "./components/Pin.vue";


// Point personnalisé avec composant Vue monté dynamiquement
export class Pin extends Marker {
	private vueApp: any;

	constructor(index: number, coords: LngLatLike, map: Map, onMove? : Function) {
		const container = document.createElement("div");

		// Monte dynamiquement le composant Vue dans le conteneur
		const app =createApp({
			render: () => 
				h(MyPinComponent, { 
					index
				})
		})

		app.mount(container);
		super({ element: container, draggable: true });
		this.vueApp = app;

		this.setLngLat(coords).addTo(map);
		
		if (onMove) {	this.on("drag", () => onMove(this));}
		
	}

	public destroy() {
		this.remove(); // supprime de la carte
		if (this.vueApp) {
			this.vueApp.unmount(); // démonte le composant Vue proprement
		}
	}
}