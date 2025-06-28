export function fromGeoDjango(point: { type: "Point", coordinates: [number, number] }): [number, number] {
  return point.coordinates; // déjà [lng, lat]
}

export function toGeoDjango([lng, lat]: [number, number]) {
  return {
    type: "Point",
    coordinates: [lng, lat]
  };
}