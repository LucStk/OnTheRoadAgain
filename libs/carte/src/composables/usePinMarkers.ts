import maplibregl from 'maplibre-gl';
import Dexie from 'dexie';
import { createApp} from "vue";
import PinMarker from "../components/PinMarker.vue";
import {db, type PinClass} from '../db/appDB';
import { useDBStore } from '../stores/storesDB';

const pinMarkers = new Map<string, maplibregl.Marker>();

export function usePinMarkers(map: maplibregl.Map) {
  if (!map) throw new Error("Components PinMarker not mounted :  map not found");
  map.on("load", async () => {
    const list = await db.pins.toArray() as PinClass[]
    for (const pin of list) {
      createOrUpdateMarker(map, pin)
    }
    setupPinHooks(map, db.pins as Dexie.Table<PinClass, string>);
  });
}

export function createMarkerElement(pin: any) {
  const container = document.createElement('div');
  const app = createApp(PinMarker, { pin });
  app.mount(container);
  return container;
}


export function createOrUpdateMarker(map: maplibregl.Map, pin: PinClass) {
  const [lng, lat] = pin.lnglat.split(',').map(Number);

  const marker = new maplibregl.Marker({
    element: createMarkerElement(pin),
    draggable: true
  })
    .setLngLat([lng, lat])
    .addTo(map);

  // On met pin.id dans la liste des pins pour pouvoir les mettre à jour
  pinMarkers.set(pin.id, marker);

  marker.on('dragend', async () => {
    const lngLat = marker.getLngLat();
    const newLngLat = `${lngLat.lng},${lngLat.lat}`;
    const pinFromDB = await db.pins.get(pin.id) as PinClass | null;
    if (pinFromDB && pinFromDB.lnglat !== newLngLat) {
      await pinFromDB.update({ lnglat: newLngLat });
    }
  });
}

export function setupPinHooks(map: maplibregl.Map, pinsTable: Dexie.Table<PinClass, string>) {
  // Création
  pinsTable.hook('creating', (_, obj, tx) => {
    tx.on('complete', () => {
      createOrUpdateMarker(map, obj);
    });
  });

  // Mise à jour
  pinsTable.hook('updating', (changes, key, _, tx) => {
    
    tx.on('complete', () => {
      const marker = pinMarkers.get(key as string);
      if (!marker) return;

      if ("lnglat" in changes) {
        const [lng, lat] = (changes.lnglat as string).split(',').map(Number);
        marker.setLngLat([lng, lat]);
      }

      if ("titre" in changes) {
        const popup = new maplibregl.Popup().setText(changes.titre as string);
        marker.setPopup(popup);
      }
    });
  });

  // Suppression
  pinsTable.hook('deleting', (key, _, tx) => {
    tx.on('complete', () => {
      const marker = pinMarkers.get(key as string);
      if (marker) {
        marker.remove();
        pinMarkers.delete(key as string);
      }
    });
  });
}
