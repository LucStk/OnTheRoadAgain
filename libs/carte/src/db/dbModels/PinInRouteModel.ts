// models/PinInRouteModel.ts
import { PinInRouteClass} from '../dbClasses';
import { db } from '../dbApp';

export class PinInRouteModel extends PinInRouteClass{
  static async addPinToRoute(pinId: string, routeId: string, order: number) {
    const id = crypto.randomUUID()
    await db.pinInRoutes.put({ id, pin_id: pinId, route_id: routeId, order })
  }

  static async removePinFromRoute(pinId: string, routeId: string) {
    const rel = await db.pinInRoutes
        .where({ pin_id: pinId, route_id: routeId })
        .first()
    if (rel) await db.pinInRoutes.delete(rel.id)
  }

  static async getPinsInRoute(routeId: string) {
  const pinInRouteList = await db.pinInRoutes.toArray()
  return pinInRouteList
    .filter(rel => rel.route_id === routeId)
    .sort((a, b) => a.order - b.order)
}
}
