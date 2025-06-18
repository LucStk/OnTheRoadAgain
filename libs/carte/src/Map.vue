<!-- script classique pour la classe -->
<script lang="ts">
import { Map } from 'maplibre-gl';
import { Route } from './js/point';
import type { Ref } from 'vue';

class Map_custom extends Map {
  routes: Route[];
  routePointsRef: Ref<any[]>;

  constructor(routePointsRef: Ref<any[]>) {
    super({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo',
      center: [-4.49993133544922, 48.41040274663766],
      zoom: 13,
    });

    this.routes = [];
    this.routePointsRef = routePointsRef;
  }

  newRoute() {
    const r = new Route(this, this.routePointsRef);
    this.routes.push(r);
    return r;
  }
}
</script>

<script setup lang="ts">
  import { onMounted, ref, type Ref } from 'vue';

  const routePoints = ref([]);

  onMounted(() => {
    const map = new Map_custom(routePoints);

    map.on('load', () => {
      map.newRoute();
    });
  });
</script>

<template>
  <div id="map" ></div>
  <!-- <RouteBar /> -->
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