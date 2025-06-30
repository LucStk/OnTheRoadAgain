// stores/map_stores.ts
import { defineStore } from 'pinia';
import { Map } from '../elements/map';
import { LngLat } from 'maplibre-gl';
import { RoutingEngine } from '../elements/routing_engine';
import { Route } from '../elements/route';
import { ref, type Ref } from 'vue';
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

async function test_init_roads_from_api() {
  const start = new LngLat(-4.49993133544922, 48.41040274663766);
  const inter = new LngLat(-4.49993133544922, 48.40540274663766);
  const end = new LngLat(-4.49993133544922, 48.40040274663766);

  const routingEngine = new RoutingEngine();
  const ret = await routingEngine.fetch_route([start, inter, end]);

  if (ret.routes?.length > 0) {
    const data = ret.routes[0];
    if (!data.geometry || !data.bbox) throw new Error("Invalid route response");

    const route = new Route(data.geometry, data.bbox, data.segments);

    // ✅ Ajout à la carte ici
    
    if (_map) {
      console.log("map loaded")
      route.addToMap();
      /*
      _map.value.on('load', () => {
        
      });*/
    }
    } else {
      throw new Error("No routes found");
    }
    
  }


  return {
    getMap,
    initMap,
    test_init_roads_from_api
  };
});
