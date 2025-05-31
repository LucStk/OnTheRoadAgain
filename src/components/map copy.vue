
<template>
  <MglMap
    :accessToken="mapboxToken"
    :mapStyle="mapStyle"
    :center="[-4.48, 48.39]"
    :zoom="[12]"
    style="width: 100%; height: 500px"
  >
    <!-- Marqueurs -->
    <MglMarker
      v-for="(coord, index) in points"
      :key="index"
      :lngLat="coord"
    />

    <!-- Source et layer ligne -->
    <MglSource
      id="line-source"
      type="geojson"
      :data="lineStringGeoJSON"
    />
    <MglLayer
      id="line-layer"
      type="line"
      source="line-source"
      :paint="{
        'line-color': '#ff0000',
        'line-width': 2
      }"
    />
  </MglMap>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { MglMap, MglNavigationControl,} from '@indoorequal/vue-maplibre-gl';

  const mapboxToken = 'AkDXKRSgsoWbmunH5eGo'
  const mapStyle = 'mapbox://styles/mapbox/streets-v11'

  const style = 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo';
  const center = [48.3904, -4.49];

  const points = ref([
    [-4.4659, 48.4067],
    [-4.5296, 48.3805],
    [-4.5260, 48.3930],
  ])

  const lineStringGeoJSON = computed(() => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points.value
    }
  }))

</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
</style>