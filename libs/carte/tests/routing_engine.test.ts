import { describe, it, expect, vi, beforeEach } from 'vitest';
import {api} from '@repo/auth'
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js';
import { createPinia, setActivePinia } from 'pinia'
import {RoutingEngine} from '../src/elements/routing_engine'
import {LngLat} from "maplibre-gl";
describe('RoutingEngineTests', () => {
    beforeEach(() => {
        // Initialise un nouveau contexte Pinia avant chaque test
        setActivePinia(createPinia())
      
    })
    
  it('Test get_route', async () => {
    let params = {
      start: "-4.49993133544922,48.41040274663766",
      end: "-4.49993133544922,48.40040274663766",
    }
    const ret  = await api.get("/ors/v2/directions/cycling-regular/", 
        {params:params}
    )
    expect(ret.status).toBe(200)
  });

  it('Essaie de créer une route avec un autre point',async () => {
    const start = new LngLat(-4.49993133544922,48.41040274663766)
    const end = new LngLat(-4.49993133544922,48.40040274663766)
    const routingEngine = new RoutingEngine()
    const ret = await routingEngine.get_route(start, end)
    expect(ret.status).not.toBe(null)
  });
    it('test post route', async () => {
    const start = new LngLat(-4.49993133544922,48.41040274663766)
    const end = new LngLat(-4.49993133544922,48.40040274663766)
    const routingEngine = new RoutingEngine()
    const ret = await routingEngine.fetch_route([start, end])
    console.log(ret)
    const features = ret.features[0].properties.segments
    const distance = features.properties.distance
    expect(ret.status).not.toBe(null)
  });
});
