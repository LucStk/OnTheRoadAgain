// stores/storesMap.ts
import { defineStore } from 'pinia';
import { Map } from '../elements/map';
import type maplibregl from 'maplibre-gl';

type MapComposable = (map: maplibregl.Map) => void;

export const useMapStore = defineStore('mapstore', () => {
  let _map: maplibregl.Map | null = null;

  // 🧩 Liste des composables à installer
  const composables: MapComposable[] = [];

  function getMap(): maplibregl.Map {
    if (!_map) throw new Error("Map not loaded");
    return _map;
  }

  function initMap(container: HTMLElement) {
    _map = new Map(container);

    // 🔁 Applique tous les composables enregistrés
    for (const composable of composables) {
      composable(_map);
    }
  }

  function registerComposable(cb: MapComposable) {
    // ✅ Si la map est déjà prête → appelle immédiatement
    if (_map) {
      cb(_map);
    } else {
      // 🕐 Sinon, stocke pour installation après initMap
      composables.push(cb);
    }
  }

  return {
    getMap,
    initMap,
    registerComposable,
  };
});