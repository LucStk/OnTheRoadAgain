import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as maplibregl from 'maplibre-gl'
import { Map as MapLibreMap } from 'maplibre-gl'
import { PMarker } from '../map_elements'
import type { Ref } from 'vue'
export const useMapStore = defineStore('map', () => {
  const _map: Ref<MapLibreMap | undefined> = ref()
  const _points: Ref<PMarker[]> = ref([])

  const initMap = () => {
    if (_map.value) return

    _map.value = new MapLibreMap({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo',
      center: [-4.49993133544922, 48.41040274663766],
      zoom: 13,
    } as maplibregl.MapOptions)

    _map.value.on('contextmenu', (e) => {
      console.log(e.lngLat)
    })
    _points.value = []
  }

  const addPoint = (lngLat: any) => {
    if (!_map.value) return
    const marker = new PMarker(lngLat, _map.value)
    _points.value.push(marker)
  }

  return {
    _map,
    _points,
    initMap,
    addPoint,
  }
})