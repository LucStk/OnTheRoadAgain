import { Marker, Map, type LngLatLike, LngLat} from "maplibre-gl";
import { createApp, h, reactive} from "vue";
import MyPinComponent from "../components/PinMarker.vue";
import { api } from "@repo/auth";
import {type PinDataLike} from "../types/pin-types.ts";
import {fromGeoDjango, toGeoDjango} from "./map.ts";

// Point personnalisé avec composant Vue monté dynamiquement
export class Pin extends Marker {
	private vueApp: any;
	public data: PinDataLike;

	constructor(coords: LngLatLike, map: Map) {
		const container = document.createElement("div");

		// Rendre "data" réactif
		const data = reactive<PinDataLike>({
			api_id: undefined,
			titre: "No title",
			description: "No description",
			user: undefined,
			createdAt: undefined,
			updatedAt: undefined,
		});
		super({ element: container, draggable: true });
		// Monte dynamiquement le composant Vue dans le conteneur

		
		
		this.data = data;
		this.setLngLat(coords).addTo(map);
		this.setEvents()

		const app =createApp({
			render: () => 
				h(MyPinComponent, { 
					data : this.data,
					destroy: () => this.destroy()
				})
		})
		app.mount(container);
		this.vueApp = app;
	}

	private setEvents() {
		this.on("click", () => {
			console.log("contextmenu")
			this.remove()
		})
		this.on("dragend", () => {
			console.log("dragend ",this.data.api_id)
			this.update_to_api()
		})
	}

	public de_serialize(request: any) {
		this.setLngLat(fromGeoDjango(request.geometry))
		this.data.titre = request.properties.titre ?? "No title"
		this.data.description = request.properties.description ?? "No description"
		this.data.api_id = request.id
	}
	public serialize() {
		return {
			latlng: toGeoDjango(this.getLngLat().toArray()),
			titre: this.data.titre ?? "New Pin",
			description: this.data.description ?? "No description",
			api_id: this.data.api_id
		}
	}
	public async destroy() {
		this.remove(); // supprime de la carte
		if (this.vueApp) {
			this.vueApp.unmount(); // démonte le composant Vue proprement
		}
		await this.delete_to_api() // supprime de la base de données
	}
	public async update_to_api() {
		if (!this.data.api_id) {
			const ret0 = await this.create_to_api()
			if (!ret0) return false
			}
	    const ret = await api.patch(`/pins/${this.data.api_id}/`, this.serialize())
		if (ret.status === 200) {
			console.log("Pin updated")
			return true
    	}
		return false
	}
	public async delete_to_api() {
		if (!this.data.api_id) return
		console.log("delete_to_api")
		const ret = await api.delete(`/pins/${this.data.api_id}/`)
		if (ret.status === 204){
			console.log("Pin supprimé")
			return true
		}else{
			console.log("Erreur lors de la suppression du pin sur le serveur")
			return false
		}
	}
	public async create_to_api() {
		const ret = await api.post("/ensembles/close_ensemble/pins/", this.serialize())
		if (ret.status === 201) {
			const id = ret.data.id
			this.data.api_id = id
			return true
		}
		return false
	}
}