// types/pin.ts

export interface BaseType {
  id          : string;
  user        : string;
  titre       : string;
  description : string;

  created_at  : string;
  updated_at  : string;

  dirty       : number;
  is_deleted  : number;
  
  type: 'ensemble' | 'pin' | 'route';
}
export interface EnsembleType extends BaseType {
  is_global: number;
  visibility: 'C' | 'O';
}

export interface PinType extends  BaseType{
  lnglat: string;
}
export interface RouteType extends  BaseType {
  geometry: string;
  bbox: number[];
  pins: string[];
}

export interface PinInRouteType {
  id: string;
  pin_id: string;
  route_id: string;
  order: number;
}

export interface ItemInEnsembleType {
  id: string;
  ensemble_id: string;
  item_id: string;
  item_type: 'pin' | 'route' | 'ensemble';
  order?: number;
}