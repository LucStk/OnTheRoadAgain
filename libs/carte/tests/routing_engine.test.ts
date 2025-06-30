import { describe, it, expect, vi, beforeEach } from 'vitest';
import {api} from '@repo/auth'
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js';
import { createPinia, setActivePinia } from 'pinia'
import {RoutingEngine} from '../src/elements/routing_engine'
import {LngLat} from "maplibre-gl";
import {Route} from "../src/elements/route"

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
    const ret  = await api.get("/ors/v2/directions/cycling-regular/geojson", 
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
    const inter = new LngLat(-4.49993133544922,48.40540274663766)
    const end = new LngLat(-4.49993133544922,48.40040274663766)
    const routingEngine = new RoutingEngine()
    const ret = await routingEngine.fetch_route([start,inter, end])
    console.log(ret)

    if (ret.routes && ret.routes.length > 0) {
        const data = ret.routes[0]
        if (!data.geometry) {
            throw new Error("Route geometry is missing")
        }

        if (!data.bbox) {
            throw new Error("Route bbox is missing")
        }

        const route = new Route(data.geometry, data.bbox, data.segments)
        expect(ret.status).not.toBe(null)
    } else {
        throw new Error("No routes found in the response")
    }
    });
});
