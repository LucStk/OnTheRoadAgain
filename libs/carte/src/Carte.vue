<script setup lang="ts">
  import { onMounted} from 'vue';
  import Save from './components/route/Save.vue';
  import {useMapStore} from './stores/map_stores';
  const mapstore = useMapStore()

  onMounted(() => {
    console.log("Map mounted")  
    mapstore.initMap()
  })
</script>

<template>
  <div id="map" ></div>
  <Save />
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