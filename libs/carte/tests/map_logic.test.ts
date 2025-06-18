import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Map_custom, Point } from './map_logic';

// Simuler localStorage dans un environnement JSDOM
beforeEach(() => {
  localStorage.clear();
});

describe('Map_custom local storage', () => {
  it('should save and load points correctly', () => {
    const map = new Map_custom();

    map.addPoint([1.23, 4.56]);
    map.addPoint([7.89, 0.12]);

    map.local_save();

    const map2 = new Map_custom();
    map2.local_load();

    expect(map2.points.length).toBe(2);
    expect(map2.points[0].coord).toEqual([1.23, 4.56]);
    expect(map2.points[1].coord).toEqual([7.89, 0.12]);
  });

  it('should store valid JSON in localStorage', () => {
    const map = new Map_custom();
    map.addPoint([5.5, 6.6]);
    map.local_save();

    const raw = localStorage.getItem("points");
    expect(raw).toBe(JSON.stringify([{ coord: [5.5, 6.6] }]));
  });

  it('should handle empty storage gracefully', () => {
    const map = new Map_custom();
    map.local_load(); // rien à charger
    expect(map.points).toHaveLength(0);
  });
});
