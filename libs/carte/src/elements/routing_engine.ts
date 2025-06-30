import { api, useAuthStore } from '@repo/auth'
import { LngLat } from 'maplibre-gl'

export class RoutingEngine {
  constructor() {
    const auth = useAuthStore()
    auth.login("alice@example.com", "alicepassword")
  }
  public async get_route(start: LngLat, end: LngLat) {
    const response = await api.get("/ors/v2/directions/cycling-regular/", {
      params: {
        start: `${start.lng},${start.lat}`,
        end: `${end.lng},${end.lat}`,
      },
    })
    if (response.status === 200) {
      const geojson = await response.data
      return geojson
    }
    return null
  }
    public async fetch_route(coordinates : Array<LngLat>) {
    const data = {
        coordinates: coordinates.map(e => [e.lng, e.lat]),
    }
    console.log(data)
    const response = await api.post("/ors/v2/directions/cycling-regular/json/", data)
    if (response.status === 200) {
      const geojson = await response.data
      return geojson
    }
    return null
  }
}