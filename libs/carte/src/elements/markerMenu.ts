import { Marker, Map, type LngLatLike, LngLat} from "maplibre-gl";
import { createApp, h, type Ref,ref} from "vue";
import MyPinComponent from "../components/MarkerMenu.vue";
import { useMapStore } from "../stores/map_stores.ts";
import {Pin} from "./pin"
import {PinRoute} from "./pinRoute"
import {Route} from "./route"

// Point personnalisé avec composant Vue monté dynamiquement
export class MarkerMenu extends Marker {
	public map: maplibregl.Map;
	private vueApp: any;
	private visible: Ref<boolean>;
	private origin: PinRoute | null = null;
	private destination: PinRoute | null = null;

	constructor() {
		const container = document.createElement("div");
		super({ element: container, draggable: false });

		const mapstore = useMapStore()
		this.map = mapstore.getMap();
		this.setLngLat([0, 0]);
		this.addTo(this.map);
		this.visible = ref(false);
		const app = createApp({
			data() {
				return { visible: false };
			},
			render: () => 
				h(MyPinComponent, {
				visible: this.visible,
				setPin: () => this.setPin(),
				setOrigin: () => this.setOrigin(),
				setDestination: () => this.setDestination()
				})
		});
		this.vueApp = app.mount(container);
		this.setMapEvents()
	}
	public setOrigin(){
		const pin = new PinRoute(this.getLngLat())
		if (this.origin) {this.origin.destroy()}
		this.origin = pin
		console.log(pin)
	}
	public setDestination(){
		const pin = new PinRoute(this.getLngLat())
		if (this.destination) {this.destination.destroy()}
		this.destination = pin
		console.log(pin)
		if (this.origin && this.destination) {
			const route = Route.FetchRoute(this.origin.getLngLat(), this.destination.getLngLat())
		}
	}

	public setPin(){
		const pin = new Pin(this.getLngLat())
		pin.create_to_api()
	}
	private setMapEvents() {
		this.map.on('contextmenu', (e) => {this.open(e.lngLat);});
    	this.map.on('click', () => {this.hide();});
	}

	public open(coords: LngLatLike) {
		this.setLngLat(coords);
		this.visible.value = true;
	}

	public hide() {
		this.visible.value = false;
	}
}