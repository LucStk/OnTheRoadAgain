import { LngLat, Map } from "maplibre-gl"
import type {
  FeatureCollection,
  Feature,
  LineString,
  GeoJsonProperties,
} from "geojson"

export class Route {
  bbox: [LngLat, LngLat]
  map: Map
  constructor(coords: Array<[number, number]>, bbox: [LngLat,LngLat], map: Map) {
    
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
