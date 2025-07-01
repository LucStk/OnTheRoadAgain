import { LngLat, Map } from "maplibre-gl"
import {default as googlePolyline} from "google-polyline" 
import {PinRoute} from "./pinRoute"
import type {FeatureCollection,Feature,LineString,GeoJsonProperties,} from "geojson"
import { useMapStore } from "../stores/map_stores";
import {api} from '@repo/auth'
import {fromGeoDjango, toGeoDjango, bboxToGeoJSONPolygon, geoJSONPolygonToBbox} from "./map.ts";
import { useAuthStore } from "@repo/auth";

export class Route {
  geometry: string | null = null;
  bbox: number[] | null = null;
  segments: any;
  api_id: number | null = null;
  private markers: PinRoute[] = [];

  constructor(geometry?: string, bbox?: number[], segments?: any) {
    if (geometry) this.geometry = geometry;
    if (bbox) this.bbox = bbox;
    if (segments) this.segments = segments;
  }

  addToMap() {
    const map = useMapStore().getMap()

    if (!this.geometry) return
    const coords = googlePolyline.decode(this.geometry).map(([lat, lng]) => [lng, lat]);

    const geojson: Feature<LineString> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
    };

    if (!map.getSource("route")) {
      map.addSource("route", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#FF0000",
          "line-width": 4,
        },
      });
    } else {
      const source = map.getSource("route") as maplibregl.GeoJSONSource;
      source.setData(geojson);
    }

    //map.fitBounds(this.bbox as [number, number, number, number], { padding: 40 });
  }

  public async addMarker(lngLat: LngLat) {
    const marker = new PinRoute(lngLat)
    marker.setEvents([["dragend", () => this.fetch_route()]])
    this.markers.push(marker)
    await this.fetch_route()
    //this.update_to_api()
  }

  public static async loads_Routes_from_api() {
    const auth = useAuthStore()
    if (!auth.isUserLoaded) { return }
    const ret = await api.get("/ensembles/close_ensemble/routes/")
    if (ret.status === 200) {
    console.log(ret.data)
    ret.data.forEach((e: any) => {
      const route = Route.de_serialize(e)
      route.addToMap()
    })
    }
  }

  public async fetch_route() {
    if (this.markers.length < 2) return
    const coordinates = this.markers.map((e: PinRoute) => {
      const lnglat = e.getLngLat()
      return [lnglat.lng, lnglat.lat]
    })
    const data = {
        coordinates: coordinates
    }
    console.log(data)
    const response = await api.post("/ors/v2/directions/cycling-regular/json/", data)
    if (response.status === 200) {
      const data = response.data.routes[0]
      this.geometry = data.geometry
      this.bbox = data.bbox
      this.addToMap()
    }
  }


  public async update_to_api() {
    if (!this.api_id) {
			const ret0 = await this.create_to_api()
			if (!ret0) return false
      return true
    }
    const ret = await api.patch(`/route/${this.api_id}/`, this.serialize())
		if (ret.status === 200) {
			console.log("Pin updated")
			return true
    	}
		return false
  }
  public async create_to_api(): Promise<boolean> {
		const ret = await api.post("/ensembles/close_ensemble/routes/", this.serialize())
		if (ret.status === 201) {
			const id = ret.data.id
			this.api_id = id
			return true
		}
		return false
	}
  public de_serialize(data: any) {
    console.log(data)
    this.api_id = data.id;
    this.geometry = data.geometry;
    this.bbox = geoJSONPolygonToBbox(data.bbox);
    return this;
  }
  // Static method
  public static de_serialize(data: any) {
    const route = new Route("", [], []);
    return route.de_serialize(data); // utilise la méthode d’instance
  }

  private serialize() {
    return {
      geometry: this.geometry,
      api_id: this.api_id,
      bbox : bboxToGeoJSONPolygon(this.bbox)
    }
  }
}
    
    /*
    const segmentedRoute = this.buildSegmentedGeoJSON(coords)
    this.bbox = bbox
    this.map = map
    map.addSource("segmented-route", {
      type: "geojson",
      data: segmentedRoute, // ✅ maintenant bien typé
    })

    map.addLayer({
      id: "segmented-route-layer",
      type: "line",
      source: "segmented-route",
      paint: {
        "line-color": "#3b82f6",
        "line-width": 6,
        "line-opacity": 0.8,
      },
    })

    map.on("click", "segmented-route-layer", (e) => {
      const feature = map.queryRenderedFeatures(e.point, {
        layers: ["segmented-route-layer"],
      })[0]
      if (feature) {
        alert(`Segment cliqué : ${feature.properties?.name}`)
        console.log("Feature cliquée :", feature)
      }
    })

    map.on("mouseenter", "segmented-route-layer", () => {
      map.getCanvas().style.cursor = "pointer"
    })
    map.on("mouseleave", "segmented-route-layer", () => {
      map.getCanvas().style.cursor = ""
    })
  }

  private de_serialize(request: any) {
    this.bbox = request.bbox
    const properties = request.properties
    
  }

  private buildSegmentedGeoJSON(
    coords: [number, number][]
  ): FeatureCollection<LineString, GeoJsonProperties> {
    const features: Feature<LineString, GeoJsonProperties>[] = []

    for (let i = 0; i < coords.length - 1; i++) {
      features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [coords[i], coords[i + 1]],
        },
        properties: {
          segment_id: i,
          name: `Segment ${i + 1}`,
        },
      })
    }

    return {
      type: "FeatureCollection",
      features,
    }
  }
}
*/