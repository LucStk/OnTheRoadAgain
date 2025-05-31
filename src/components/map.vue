<script setup>
import { ref, computed, watch } from 'vue'
import {
  MglMap,
  MglNavigationControl,
  MglMarker,
  MglGeoJsonSource,
  MglLineLayer
} from '@indoorequal/vue-maplibre-gl'

const style = 'https://api.maptiler.com/maps/streets-v2/style.json?key=AkDXKRSgsoWbmunH5eGo'
const center = [-4.49993133544922, 48.41040274663766]
const zoom = 8

const segmentsSourceRef = ref(null)

const points = ref([
  [-4.5296, 48.3805],
  [-4.5260, 48.3930],
  [-4.4999, 48.4104],
])


function generateGeoJSON(pointsArray) {
  const features = []
  for (let i = 0; i < pointsArray.length - 1; i++) {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [pointsArray[i], pointsArray[i + 1]]
      },
      properties: { id: i }
    })
  }
  return {
    type: 'FeatureCollection',
    features
  }
}

const initialGeoJSON = generateGeoJSON(points.value)

watch(points, () => {
  console.log("update")
  if (segmentsSourceRef.value) {
    segmentsSourceRef.value.setData(generateGeoJSON(points.value))
  }
}, { deep: true })

function handleDrag(i) {
  console.log("ping1",i)
  return (event) => {
    console.log("ping2")
    points.value[i] = [event.lngLat.lng, event.lngLat.lat]
  }
}

function handleDragEnd(i) {
  return (event) => {
    onDragEnd(event, i)
  }
}

function onDragEnd(e, i) {
  points.value[i] = [e.lngLat.lng, e.lngLat.lat]
  console.log("ping")
}
</script>


<template>
  <mgl-map :map-style="style" :center="center" :zoom="zoom">
    
    <!-- Markers draggables -->
    <mgl-marker
      v-for="(coord, i) in points"
      :key="i"
      :coordinates="coord"
      :draggable="true"
      @drag="(e) => handleDrag(e)"
      @dragend="handleDragEnd(i)"
    >
      <template #marker>
        <div
          style="background-color: #e63946; width: 12px; height: 12px; border-radius: 50%; cursor: grab;"
        />
      </template>
    </mgl-marker>
    
    <!-- Segments -->
    <mgl-geo-json-source
      ref="segmentsSourceRef"
      :source-id="'segments'"
      :data="initialGeoJSON"
    >
      <mgl-line-layer
        :layer-id="'segments-layer'"
        :source-id="'segments'"
        :paint="{
          'line-color': '#0000ff',
          'line-width': 2
        }"
      />
    </mgl-geo-json-source>

    <mgl-navigation-control />
  </mgl-map>
</template>


<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
</style>
