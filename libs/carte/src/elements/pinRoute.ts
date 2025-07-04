import { Marker, Map, type LngLatLike, LngLat} from "maplibre-gl";
import { createApp, h, type Ref,ref} from "vue";
import MyPinComponent from "../components/PinRoute.vue";
import { useMapStore } from "../stores/storesMap.ts";
import {Pin} from "./pin"


// Point personnalisé avec composant Vue monté dynamiquement
export class PinRoute extends Marker {
    public map: maplibregl.Map;
    private vueApp: any;

    constructor(coords: LngLatLike) {
        const container = document.createElement("div");
        super({ element: container, draggable: true });

        const mapstore = useMapStore()
        this.map = mapstore.getMap();
        this.setLngLat(coords);
        this.addTo(this.map);
        const app =createApp({
            render: () => 
                h(MyPinComponent, { 
                    destroy: () => this.destroy()
                })
        })
        this.vueApp = app.mount(container);
        container.addEventListener('onclick', (e) => {
            e.stopPropagation()
        })
        container.addEventListener('onmousedown', (e) => {
            e.stopPropagation()
        })
        container.addEventListener('onmousehover', (e) => {
            e.stopPropagation()
        })
    }

    public destroy() {
		this.remove(); // supprime de la carte
		if (this.vueApp) {
			this.vueApp.unmount(); // démonte le composant Vue proprement
		}
	}
}