import { defineStore } from 'pinia'
import { Map as MapLibreMap } from 'maplibre-gl'
import { Pin } from '../elements/pin'
import {api} from "@repo/auth"


export const useMapStore = defineStore('map', () => {
  let _map: MapLibreMap

  const initMap = () => {
    _map = new MapLibreMap({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo',
      center: [-4.49993133544922, 48.41040274663766],
      zoom: 13,
    })
    _map.on('contextmenu', (e) => {
      new Pin(e.lngLat, _map)
    })
    init_Pins_from_api()
  }

  async function init_Pins_from_api() {
    const ret = await api.get("/ensembles/close_ensemble/pins/")
    if (ret.status === 200) {
      ret.data.features.forEach((e: any) => {
        console.log(e)
        const p = new Pin(e.geometry.coordinates.reverse(), _map)
        p.de_serialize(e)
      })
    }
  }


  return {
    initMap,
  }
})