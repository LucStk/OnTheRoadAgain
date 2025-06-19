// vitest.setup.ts
import { vi } from 'vitest';

globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

vi.mock('../src/map_elements', async () => {
  const actual = await vi.importActual<typeof import('./src/map_elements')>('../src/map_elements');

  return {
    ...actual,
    Point: class MockPoint {
      lngLat: [number, number];
      constructor(coords: [number, number]) {
        this.lngLat = coords;
      }
      getLngLat() {
        return {
          toArray: () => this.lngLat,
          lng: this.lngLat[0],
          lat: this.lngLat[1],
        };
      }
    }
  };
});