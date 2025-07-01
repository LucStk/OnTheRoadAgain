/// <reference types="vite/client" />

// src/types/google-polyline.d.ts
declare module 'google-polyline' {
  export function decode(str: string): [number, number][];
  export function encode(coords: [number, number][]): string;
}

interface PhotonFeature {
  type: 'Feature'
  geometry: {
    type: string
    coordinates: [number, number]
  }
  properties: {
    name: string
    country: string
    [key: string]: any
  }
}
