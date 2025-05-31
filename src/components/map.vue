
<template>
  <div id="map"></div>
</template>


<script setup>
  import { onMounted,ref, watch} from 'vue';
  import {Map_custom} from '@/js/map'

  const routePoints = ref([]); // 🔁 partagé avec Route
  const refmap = ref(null)

onMounted(() => {
  // ── 1) Instanciation de la map / stockage dans refmap ──
  const map = new Map_custom(routePoints);
  refmap.value = map;

  // ── 2) Quand le style est chargé, on crée une Route et on pose 2 points ──
  map.on('load', () => {
    const route = map.newRoute();
    route.addPoint([-4.5, 48.41]);
    route.addPoint([-4.51, 48.412]);
    route.addPoint([-4.52, 48.412]);

    // ── 3) On forcera manuellement la mise à jour au cas où le watch ne l’aurait pas encore fait ──
    map.getSource('route-source').setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routePoints.value
      }
    });
    
  });
});

// ── 4) Watch sur routePoints (avec immediate: true) ──
watch(
  routePoints,
  (coords) => {
    const map = refmap.value;
    // On attend au moins 2 points et le style chargé
    if (!map || !map.isStyleLoaded() || coords.length < 2) return;

    const src = map.getSource('route-source');
    if (src) {
      console.log("okey")
      src.setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coords
        }
      });
    }
  },
  { immediate: true }
);
</script>



<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";

#map { height: 100%; }

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
