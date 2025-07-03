// types/pin.ts

export interface BaseInterface {
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
export interface Ensemble extends BaseInterface {
  id: string;  // FK vers BaseSyncObject.id
  is_global: number;
  visibility: 'C' | 'O';
}
export interface BaseEnsembleElement extends BaseInterface {
  id: string; // FK vers BaseSyncObject.id
  ensemble_fk: string;
}
export interface Pin extends BaseEnsembleElement {
  lnglat: string;
}
export interface Route extends BaseEnsembleElement {
  geometry: string;
  bbox: string;
  origine: string;
  destination: string;
}