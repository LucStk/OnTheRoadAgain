import { defineStore } from 'pinia'
import { Map as MapLibreMap } from 'maplibre-gl'
import {type LngLatLike} from "maplibre-gl";
import { Pin } from '../map_elements'
import { ref } from 'vue'

export interface CPin {
  lngLat: LngLatLike;
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
      console.log(e.lngLat)
      addPoint(e.lngLat)
    })
  }

  const addPoint = (lnglt: LngLatLike) => {
    if (!_map) return
    const m = new Pin(index, lnglt, _map)
    m.on("click", () => {
      console.log("contextmenu")
      removePoint(index)
    })
    _pinsMarkers.set(index, m)
    _pins.value[index] = {lngLat: lnglt}
    index++
  }

  const removePoint = (index: number) => {
    if (!_map) return
    const pm = _pinsMarkers.get(index)
    if (pm){
      console.log(pm.destroy)
      pm.destroy()
    }
    _pinsMarkers.delete(index)
    delete _pins.value[index]
  }
  

  return {
    _map,
    _pins,
    initMap,
    addPoint,
    removePoint
  }
})