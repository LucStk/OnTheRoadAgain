import { defineStore } from 'pinia'
import { Map as MapLibreMap } from 'maplibre-gl'
import {type LngLatLike, LngLat} from "maplibre-gl";
import { Pin } from '../map_elements'
import { ref } from 'vue'
import {api} from "@repo/auth"

export interface CPin {
  lnglat: LngLatLike;
  api_id?: number;
  title?: string;
  description?: string;
  isSelected?: boolean;
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export const useMapStore = defineStore('map', () => {
  let _map: MapLibreMap | undefined
  const _pins = ref<Record<number, CPin>>({})
  const _pinsMarkers = new Map<number, Pin>()
  let index : number = 0

  const initMap = () => {
    _map = new MapLibreMap({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo',
      center: [-4.49993133544922, 48.41040274663766],
      zoom: 13,
    })
    _map.on('contextmenu', (e) => {
      createPin(e.lngLat)
    })
    getPins()
  }

  async function createPin(lnglt: LngLatLike) {
    if (!_map) return
    const { lng, lat } = LngLat.convert(lnglt)
    const data = {
      latlng: {
        type: "Point",
        coordinates: [lat, lng]
      },
      title: "New Pin",
      description: "No description yet",
    }

    const ret = await api.post("/ensembles/close_ensemble/pins/", data)
    if (ret.status === 201) {
      const id = ret.data.id
      addPoint(lnglt, id, data.title, data.description)
    }
  }

  async function patchPin(index: number) {
    if (!_map) return
    
    const pin = _pins.value[index]
    const Mpin = _pinsMarkers.get(index)
    if (!Mpin) return
    console.log(_pins.value[index])
    const { lng, lat } = LngLat.convert(Mpin.getLngLat())
    const data = {
      latlng: {
        type: "Point",
        coordinates: [lat, lng]
      },
      title: pin.title ?? "No title",
      description: pin.description ?? "No description",
    }
    if (!pin.api_id) return
    const ret = await api.patch(`/pins/${pin.api_id}/`, data)
    if (ret.status === 200) {
      console.log("Pin updated")
    }
    return ret
  }

  async function addPoint(lnglt: LngLatLike, api_id?: number, title?: string, description?: string){
    if (!_map) return
    const currentIndex = index 
    const m = new Pin(currentIndex, lnglt, _map)
    _pinsMarkers.set(currentIndex, m)
    _pins.value[currentIndex] = {lnglat: lnglt, api_id, title, description}

    m.on("click", () => {
      console.log("contextmenu")
      removePoint(currentIndex)
    })
    m.on("dragend", () => {
      console.log("dragend ",currentIndex)
      patchPin(currentIndex)
    })
    
    index++
  }

  async function getPins() {
    const ret = await api.get("/ensembles/close_ensemble/pins/")
    if (ret.status === 200) {
      ret.data.features.forEach((e: any) => {
        let coord = LngLat.convert(e.geometry.coordinates.reverse())
        addPoint(coord, e.id, e.properties.title, e.properties.description)
      })
    }
  }

  async function postPins(pin: CPin) {
    const { lng, lat } = LngLat.convert(pin.lnglat)
    const data = {
      latlng: {
        type: "Point",
        coordinates: [lat, lng]
      },
      title: pin.title ?? "New Pin",
      description: pin.description ?? "No description",
    }

    const ret = await api.post("/ensembles/close_ensemble/pins/", data)
    if (ret.status === 201) {
      const id = ret.data.id
      pin.api_id = id
    }
    return ret
  }
  const savePins = () => {
    for (const [key, value] of Object.entries(_pins.value)) {
      postPins(value)
    }
  }

  async function removePoint(index: number) {
    if (!_map) return
    
    // On supprime graphiquement le point
    const pm = _pinsMarkers.get(index)
    if (pm){
      console.log(pm.destroy)
      pm.destroy()
    }
    _pinsMarkers.delete(index)

    // On essaie de supprimer le point dans la base de données
    const pin = _pins.value[index]
    console.log(pin)
    if (pin.api_id){
      const ret = await api.delete(`/pins/${pin.api_id}/`)
      if (ret.status === 204){
        console.log("Pin supprimé")
      }else{
        console.log("Erreur lors de la suppression du pin sur le serveur")
      }
    }
    delete _pins.value[index]
  }
  

  return {
    _map,
    _pins,
    initMap,
    addPoint,
    removePoint,
    savePins
  }
})