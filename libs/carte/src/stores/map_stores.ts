// stores/map_stores.ts
import { defineStore } from 'pinia';
import { Map } from '../elements/map';
import type maplibregl from 'maplibre-gl';

export const useMapStore = defineStore('mapstore', () => {
  let _map: maplibregl.Map | null = null;

  function getMap(): maplibregl.Map {
    if (!_map) throw new Error("Map not loaded");
    return _map;
  }

  function initMap(container: HTMLElement) {
    _map = new Map(container);
  }

  return {
    getMap,
    initMap,
  };
});
