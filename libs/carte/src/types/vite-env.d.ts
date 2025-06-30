/// <reference types="vite/client" />

// src/types/google-polyline.d.ts
declare module 'google-polyline' {
  export function decode(str: string): [number, number][];
  export function encode(coords: [number, number][]): string;
}