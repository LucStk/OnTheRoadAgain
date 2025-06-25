import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Map_custom } from '../map_elements'

export const useMapStore = defineStore('map', () => {
  const _map = ref<Map_custom | null>(null)
  const _points = ref<any>(null)

  const initMap = () => {
    if (_map.value) return;

    console.log('Map_store: Map is null, creating a new one');
    const m = new Map_custom();

    m.on('contextmenu', (e) => {
      m.addPoint(e.lngLat);
      console.log(e.lngLat);
    });

    _map.value = m;
  }

  return {
    _map,
    _points,
    initMap,
  }
})
