import { LngLat, Map } from "maplibre-gl"
import {default as googlePolyline} from "google-polyline" 
import type {
  FeatureCollection,
  Feature,
  LineString,
  GeoJsonProperties,
} from "geojson"


export class Route {
  geometry: string;
  bbox: number[];
  segments: any;

  constructor(geometry: string, bbox: number[], segments: any) {
    this.geometry = geometry;
    this.bbox = bbox;
    this.segments = segments;
  }

  addToMap(map: maplibregl.Map) {
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