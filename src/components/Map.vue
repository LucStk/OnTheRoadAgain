
<template>

  <div id="map" ></div>
  <RouteBar />
</template>

<script setup>
  import { onMounted,ref, watch, inject} from 'vue';
  import {Map_custom} from '@/js/map'
  import { useIndexStore } from '@/stores/global'

  const routePoints = ref([]); // 🔁 partagé avec Route
  const road_data = inject('road')

  onMounted(() => {
    // ── 1) Instanciation de la map / stockage dans refmap ──
    const map = new Map_custom(routePoints);

    // ── 2) Quand le style est chargé, on crée une Route et on pose 2 points ──
    map.on('load', () => {
      const route = map.newRoute();
      road_data.value.etapes.forEach(element => {
        route.addPoint(element.long_lat);
      });
    });
  });
</script>



<style lang="scss">
  @import "maplibre-gl/dist/maplibre-gl.css";

  #map{
    height: 100%;
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
