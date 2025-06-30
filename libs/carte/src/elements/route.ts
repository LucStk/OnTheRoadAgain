import { LngLat, Map } from "maplibre-gl"
import {default as googlePolyline} from "google-polyline" 
import type {
  FeatureCollection,
  Feature,
  LineString,
  GeoJsonProperties,
} from "geojson"

import { RoutingEngine } from "./routing_engine";
import { useMapStore } from "../stores/map_stores";
import {api} from '@repo/auth'
import {fromGeoDjango, toGeoDjango, bboxToGeoJSONPolygon, geoJSONPolygonToBbox} from "./map.ts";
import { useAuthStore } from "@repo/auth";
export class Route {
  geometry: string;
  bbox: number[];
  segments: any;
  api_id: number | null = null;

  constructor(geometry: string, bbox: number[], segments?: any) {
    this.geometry = geometry;
    this.bbox = bbox;
    this.segments = segments;
  }

  public static async FetchRoute(start: LngLat, end: LngLat): Promise<Route>{
    const routingEngine = new RoutingEngine();
    const ret = await routingEngine.fetch_route([start, end]);
    const data = ret.routes[0];
    if (!data.geometry || !data.bbox) throw new Error("Invalid route response");
    const route = new Route(data.geometry, data.bbox, data.segments);
    route.addToMap();
    return route
  }

  addToMap() {
    const map = useMapStore().getMap()

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

    map.fitBounds(this.bbox as [number, number, number, number], { padding: 40 });
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

  public async update_to_api() {
    if (!this.api_id) {
			const ret0 = await this.create_to_api()
			if (!ret0) return false}
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
  public static de_serialize(request: any) {
    const api_id = request.id
    const geometry = request.geometry
    const bbox = geoJSONPolygonToBbox(request.bbox)
    const route = new Route(geometry, bbox, null)
    route.api_id = api_id
    return route
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