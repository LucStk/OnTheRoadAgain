import { Marker, Map, type LngLatLike, LngLat} from "maplibre-gl";
import { createApp, h, type Ref,ref} from "vue";
import MyPinComponent from "../components/MarkerMenu.vue";
import { useMapStore } from "../stores/map_stores.ts";
import {Pin} from "./pin"

// Point personnalisé avec composant Vue monté dynamiquement
export class MarkerMenu extends Marker {
	public map: maplibregl.Map;
	private vueApp: any;
	private visible: Ref<boolean>;

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
				setPin: () => this.setPin()
				})
		});
		this.vueApp = app.mount(container);
		this.setMapEvents()
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