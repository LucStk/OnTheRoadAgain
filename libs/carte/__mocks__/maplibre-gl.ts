import { LngLatBounds } from 'maplibre-gl';
import { vi } from 'vitest';

let listeners: Record<string, Function[]> = {};

export const fakeCanvasStyle = {};

export class MockMap {
  on(event: string, callback: Function) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }

  emit(event: string, payload?: any) {
    (listeners[event] || []).forEach(cb => cb(payload));
  }

  addSource(id: string, source: any) {
    this.sources[id] = source;
  }

  addLayer(layer: any) {
    this.layers.push(layer);
  }

  getSource(id: string) {
    return {
      setData: vi.fn()
    };
  }

  getCanvas() {
    return { style: fakeCanvasStyle };
  }

  fitBounds = vi.fn();

  sources: Record<string, any> = {};
  layers: any[] = [];
}

export class MockMarker {
  lngLat: [number, number] = [0, 0];
  constructor(opts: any) {}
  setLngLat(lngLat: [number, number]) {
    this.lngLat = lngLat;
    return this;
  }
  addTo(map: any) {
    return this;
  }
  getLngLat() {
    return {
      toArray: () => this.lngLat,
      ...this.lngLat
    };
  }
  on() {}
}


export const Marker = MockMarker;
export const Map = MockMap;
export { LngLatBounds };
export type LngLatLike = [number, number];
