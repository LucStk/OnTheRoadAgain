<template>
  <div id="map"></div>
  <div class="bg-white border-t border-gray-300">
    <EtapesConteneur />
  </div>

</template>

<script setup> 
  import { onMounted, inject } from 'vue';
  import { Map } from '@/js/map.js';
  import 'leaflet/dist/leaflet.css';
  import EtapesConteneur from "./route/conteneur.vue";
  const road_data = inject('road');

  onMounted(() => {
    const map = new Map();
    
    //On lit les points de road et on les affiches sur la carte
    var road = map.newRoute();
    console.log(road_data)
    road_data.value.etapes.forEach( i =>{
    
      let nwpt = road.addPoint(i.lat_lont)
    
    })
  });
  
</script>

<style>
  #map {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 0; /* en arrière-plan */
  }
</style>