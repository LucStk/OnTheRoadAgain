import type { BaseType, EnsembleType, PinType, RouteType } from "./dbTypes/db-items";
import type { PinInRouteType, FamilyTreeType} from './dbTypes/db-items'

export abstract class BaseClass implements BaseType {
  id!: string;
  user!: string;
  titre!: string;
  description!: string;
  created_at!: string;
  updated_at!: string;
  dirty!: number;
  is_deleted!: number;
  type!: 'ensemble' | 'pin' | 'route';

  constructor(data?: Partial<BaseType>) {
    if (data) {
      Object.assign(this, data);
    }
  }  
}

export class EnsembleClass extends BaseClass implements EnsembleType {
  visibility!: 'C' | 'O';
  is_global!: number;

  constructor(data?: Partial<EnsembleType>) {
    super(data);
    if (data) {Object.assign(this, data);}
  }
}

export class PinClass extends BaseClass implements PinType{
  ensemble_fk!: string;
  lnglat!: string;

  constructor(data?: Partial<PinType>) {
    super(data);
    if (data) {Object.assign(this, data);}
  }
}

export class RouteClass extends BaseClass  implements RouteType {
  ensemble_fk!: string;
  geometry!: string;
  bbox!: number[];
  pins!: string[];

  constructor(data?: Partial<RouteType>) {
    super(data);
    if (data) {Object.assign(this, data);}
  }
}

export class PinInRouteClass implements PinInRouteType {
  id!: string;
  pin_id!: string;
  route_id!: string;
  order!: number;

  constructor(data?: Partial<PinInRouteType>) {
    if (data) {Object.assign(this, data);}
  }
}

export class FamilyTreeClass implements FamilyTreeType {
  id!: string;
  child_id!: string;
  parent_id?: string;
  order?: number;

  constructor(data?: Partial<FamilyTreeType>) {
    if (data) {Object.assign(this, data);}
  }
}