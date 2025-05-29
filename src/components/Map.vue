<template>
  <div id="map"></div>
</template>

<script setup> 
import { onMounted } from 'vue';
import 'leaflet/dist/leaflet.css';
import { Map } from '@/js/map.js';

onMounted(() => {const map = new Map();});
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