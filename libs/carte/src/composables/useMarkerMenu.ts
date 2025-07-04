import maplibregl from 'maplibre-gl';
import { createApp, h, ref } from "vue";
import MarkerMenu from "../components/MarkerMenu.vue";
import { PinModel } from "../db/dbModels";

export function useMarkerMenu(map: maplibregl.Map) {
  if (!map) throw new Error("Components MarkerMenu not mounted: map not found");

  const setup = () => {
    const container = document.createElement("div");
    const appVisible = ref(false);
    const lngLat = ref<[number, number]>([0, 0]);

    const marker = new maplibregl.Marker({ element: container, draggable: false })
      .setLngLat([0, 0])
      .addTo(map);

    const app = createApp({
      setup() {
        return () =>
          h(MarkerMenu, {
            visible: appVisible.value,
            lngLat: lngLat.value,
            onClose: () => (appVisible.value = false),
            onSetPin: (lnglat: [number, number]) => {
              console.log("📍 Set pin at", lnglat.join(','));
              PinModel.create({ lnglat: lnglat.join(',') });
              appVisible.value = false;
            },
          });
      },
    });

    app.mount(container);

    map.on("contextmenu", (e) => {
      lngLat.value = [e.lngLat.lng, e.lngLat.lat];
      marker.setLngLat(lngLat.value);
      appVisible.value = true;
    });
  };

  if (map.loaded()) {
    setup();
  } else {
    map.on("load", setup);
  }
}
