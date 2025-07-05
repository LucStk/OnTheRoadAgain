// models/RouteModel.ts
import { RouteClass } from '../dbClasses';
import { db } from '../dbApp';
import { withBaseModel } from './BaseModelMixin';
import { computeBBox } from '../../elements/map';
import googlePolyline from 'google-polyline';
import { PinModel } from './PinModel';
import type { BaseModelShape } from '../dbTypes/withBase.Model';
import { FamilyTreeModel } from './FamilyTreeModel';

const _RouteModel = withBaseModel(RouteClass, db.routes);
export class RouteModel extends _RouteModel {
   static override async create(data: Partial<RouteClass>): Promise<BaseModelShape> {
      const defaults = {
        type: 'route' as const,
        pins: [],
        bbox: [],
        geometry: '',
        titre: 'New route',
      }
      const instance = new this(this.enrich({ ...defaults, ...data }));
      await (instance as any).save();
      await FamilyTreeModel.addChildtoParent(instance.id, undefined, 0)
          
      return instance;
  }

  async updateGeometryFromPoints(pins: PinModel[]) {
    const coords = pins.map<[number, number]>(pin => {
      const [lng, lat] = pin.lnglat.split(',').map(Number);
      return [lat, lng];
    });

    this.geometry = googlePolyline.encode(coords);
    const bboxCoords = coords.map(([lat, lng]) => [lng, lat]);
    this.bbox = computeBBox(bboxCoords);
    await this.save();
    
  }
}