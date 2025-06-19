import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from '../src/map_elements';
import type { LngLatLike } from 'maplibre-gl';
import { MockMap, fakeCanvasStyle } from '../__mocks__/maplibre-gl';

describe('Route', () => {
  let map: any;
  let pointsRef: { value: LngLatLike[] };

  beforeEach(() => {
    map = new MockMap();
    pointsRef = { value: [] };
  });

  it('initializes route and sets up map layers', () => {
    const route = new Route(map);

    expect(map.sources['route-source']).toBeDefined();
    expect(map.layers.length).toBeGreaterThan(0);
  });

  it('adds point and fits bounds', () => {
    const route = new Route(map, pointsRef);

    const coord: LngLatLike = [1, 2];
    route.addPoint(coord);

    expect(route.markers.length).toBe(1);
    expect(map.fitBounds).toHaveBeenCalled();
  });

  it('updates the route when new point added', () => {
    const route = new Route(map, pointsRef);
    const spy = vi.spyOn(route, 'updateRoute');

    route.addPoint([1, 1]);
    route.addPoint([2, 2]);

    expect(spy).toHaveBeenCalledTimes(2); // une fois à chaque ajout
  });

  it('responds to click and updates selection', () => {
    const route = new Route(map, pointsRef);
    const coord: LngLatLike = [1, 1];
    route.addPoint(coord);
    route.addPoint([2, 2]);

    const fakeFeature = {
      features: [
        {
          properties: {
            segmentIndex: 0
          }
        }
      ]
    };

    // Simuler clic sur le segment
    map.emit('click', fakeFeature);

    expect(route.selectedSegmentIndex).toBe(0);
  });

  it('handles mouse enter/leave events', () => {
    new Route(map, pointsRef);

    map.emit('mouseenter');
    expect(fakeCanvasStyle.cursor).toBe('pointer');

    map.emit('mouseleave');
    expect(fakeCanvasStyle.cursor).toBe('');
  });
});
