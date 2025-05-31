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

//Création des lignes entre les points 
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



function onDrag(event, i) {
  console.log("ping1",i,event)
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
      @drag="onDrag($event, i)"
    >
      <template #marker>
        <div
          style="background-color: #e63946; width: 12px; height: 12px; border-radius: 50%; cursor: grab;"
        />
      </template>
    </mgl-marker>
  </mgl-map>
</template>


<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
</style>
