// models/RouteModel.ts
import { RouteClass } from '../dbClasses';
import { db } from '../dbApp';
import { withBaseModel } from './BaseModelMixin';
import { computeBBox } from '../../elements/map';
import googlePolyline from 'google-polyline';
import { PinModel } from './PinModel';

const _RouteModel = withBaseModel(RouteClass, db.routes);
export class RouteModel extends _RouteModel {
   static override async create<T>(
    this: new (data: Partial<T>) => T,
    data: Partial<T>) {
      const defaults = {
        type: 'route',
        pins: [],
        bbox: [],
        geometry: '',
        titre: 'New route',
        ...data,
      }    
      super.create.call(this, { ...defaults, ...data }) as T;
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