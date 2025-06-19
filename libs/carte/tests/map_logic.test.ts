import { vi } from 'vitest';

import { describe, it, expect,beforeEach } from 'vitest';

import { Map_custom } from '../src/map_elements'; // ✅ maintenant c’est bon, après le mock

describe('Map_custom', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and load points', () => {
    const map = new Map_custom();
    map.addPoint([1.23, 4.56]);
    map.local_save();

    const map2 = new Map_custom();
    map2.local_load();

    expect(map2.points.length).toBe(1);
  });
});