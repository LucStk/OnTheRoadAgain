<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMapStore } from './stores/storesMap';
//import Bibliotheque from './components/Bibliotheque.vue'
import Save from './components/Save.vue';
import { usePinMarkers } from './composables/usePinMarkers';
import { useMarkerMenu } from './composables/useMarkerMenu';
import { useDBStore } from './db/usedbStores';

useDBStore()
const mapContainer = ref<HTMLElement | null>(null);
const mapstore = useMapStore();
mapstore.registerComposable(usePinMarkers);
mapstore.registerComposable(useMarkerMenu);

onMounted(() => {
  if (mapContainer.value) {
    mapstore.initMap(mapContainer.value);

  } else {
    console.error("Map container not found");
  }
});

</script>

<template>
  <!-- <Searchbar /> 
  <Bibliotheque />-->
  <Save />
  <div ref="mapContainer" id="map" class="z-0"></div>
</template>

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