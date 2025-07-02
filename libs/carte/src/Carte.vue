<template>
  <Searchbar />
  <Bibliotheque />
  <div ref="mapContainer" id="map" class="z-0"></div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useMapStore } from './stores/map_stores';
import {Pin} from './elements/pin'
import {Route} from './elements/route'
import Bibliotheque from './components/Bibliotheque.vue'
import {MarkerMenu} from './elements/markerMenu'
import Searchbar from './components/Searchbar.vue';
/*
const mapContainer = ref<HTMLElement | null>(null);
const mapstore = useMapStore();

onMounted(() => {
  if (mapContainer.value) {
    mapstore.initMap(mapContainer.value);
    //mapstore.init_roads_from_api()
    new MarkerMenu()
    //Pin.setMapEvents()
    Pin.loads_Pins_from_api()
    mapstore.getMap().on('load', () => {
      //Route.loads_Routes_from_api()
      
    }); 

  } else {
    console.error("Map container not found");
  }
});*/
</script>

<style lang="scss">
  @import "maplibre-gl/dist/maplibre-gl.css";

  #map{
    height: 800px;
  }

  .coordinates {
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      position: absolute;
      bottom: 40px;
      left: 10px;
      padding: 5px 10px;
      margin: 0;
      font-size: 11px;
      line-height: 18px;
      border-radius: 3px;
      display: none;
  }
</style>