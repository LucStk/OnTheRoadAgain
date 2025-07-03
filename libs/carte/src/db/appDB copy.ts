import Dexie, { type Table } from 'dexie';
import 'dexie-relationships'; // il faut l'importer pour activer le plugin

export interface BaseSyncObject {
  id: string;
  user: string;
  titre: string;
  description: string;
  created_at: string;
  updated_at: string;
  dirty: number;
  is_deleted: number;
  type: 'ensemble' | 'pin' | 'route';
}

export interface Ensemble extends BaseSyncObject {
  id: string;  // FK vers BaseSyncObject.id
  is_global: number;
  visibility: 'C' | 'O';
}

export interface BaseEnsembleElement extends BaseSyncObject {
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

export class AppDB extends Dexie {
  ensembles!: Table<Ensemble, string>;
  pins!: Table<Pin, string>;
  routes!: Table<Route, string>;

  constructor() {
    super('AppDB');
    this.version(1).stores({
      baseSyncObjects: 'id, user, created_at, updated_at,dirty',
      ensembles: 'id, visibility, updated_at, dirty',
      pins: 'id, ensemble_fk, updated_at, dirty',
      routes: 'id, ensemble_fk, updated_at, dirty'
    });

    this.ensembles.mapToClass(EnsembleClass);
    this.pins.mapToClass(PinClass);
    this.routes.mapToClass(RouteClass);
  }
}
// Exemple de classe avec relation 1:1

class BaseSyncObjectClass {
  id!: string;
  type!: 'ensemble' | 'pin' | 'route';

  user!: string;
  titre!: string;
  description!: string;

  created_at!: string;
  updated_at!: string;
  dirty!: number;
  is_deleted!: number;

  ensemble?: EnsembleClass;
  pin?: PinClass;
  route?: RouteClass;



  async update(data: Partial<BaseSyncObject> & Partial<Ensemble | Pin | Route>) {
    const baseUpdateFields: Partial<BaseSyncObject> = {};
    const childUpdateFields: Partial<Ensemble | Pin | Route> = {};

    for (const key in data) {
      // On ne met pas à jour les champs de la table de base pour la synchronisation
      if (key in ["id", "type", "created_at", "updated_at", "dirty", "is_deleted"]) { continue;}

      if (['user', 'titre', 'description'].includes(key)) {
        baseUpdateFields[key as keyof BaseSyncObject] = data[key as keyof BaseSyncObject] as any;
      } else {
        childUpdateFields[key as keyof (Ensemble | Pin | Route)] = data[key as keyof (Ensemble | Pin | Route)] as any;
      }
    }

    // Met à jour updated_at et dirty automatiquement
    const nowIso = new Date().toISOString();
    baseUpdateFields.updated_at = nowIso;
    baseUpdateFields.dirty = 1;

    await db.baseSyncObjects.update(this.id, baseUpdateFields);

    switch(this.type) {
      case 'ensemble':
        if (Object.keys(childUpdateFields).length > 0) {
          await db.ensembles.update(this.id, childUpdateFields as Partial<Ensemble>);
        }
        break;

      case 'pin':
        if (Object.keys(childUpdateFields).length > 0) {
          await db.pins.update(this.id, childUpdateFields as Partial<Pin>);
        }
        break;

      case 'route':
        if (Object.keys(childUpdateFields).length > 0) {
          await db.routes.update(this.id, childUpdateFields as Partial<Route>);
        }
        break;
    }

    Object.assign(this, data);
    this.updated_at = nowIso;
    this.dirty = 1;
  }
}


export class EnsembleClass {
  id!: string;
  visibility!: 'C' | 'O';

  baseSyncObject?: BaseSyncObjectClass;
}

export class PinClass {
  id!: string;
  ensemble_fk!: string;
  lnglat!: string;

  baseSyncObject?: BaseSyncObjectClass;
}

export class RouteClass {
  id!: string;
  ensemble_fk!: string;
  geometry!: string;
  bbox!: string;
  origine!: string;
  destination!: string;

  baseSyncObject?: BaseSyncObjectClass;
}

export const db = new AppDB();

/*

  const pullFromBackend = async () => {
    const lastSync = await getLastSyncTime();

    // 1. Pull des ensembles
    const response = await api.get(`/ensembles/pull/?since=${lastSync}`)
    const updated = await response?.data
    for (const item of updated) {
        await db.ensemble.put(item)
        console.log("pull : item.id:", item.id)
    }

    // 2. Pull des pins
    const response2 = await api.get(`/pins/pull/?since=${lastSync}`)
    const updated2 = await response2?.data
    console.log("pull : updated.length:", updated2)
    for (const item of updated2) {
        await db.pin.put(item)
        console.log("pull : item.id:", item.id)
    }

    await setLastSyncTime(new Date().toISOString());
  }

  const pushToBackend = async () => {
    // 2. Push local vers backend
    let localDirty = await db.ensemble.where('dirty').equals(1).toArray();
    if (localDirty.length > 0) {
      const response = await api.post('/ensembles/push/', localDirty);
      console.log("response:", response)
      // Marque comme propre
      
      await Promise.all(response.data.map((item: Ensemble) =>{
        db.ensemble.update(item.id, { dirty: 0})
        console.log("push : item.id:", item.id)
      }));
      await setLastSyncTime(new Date().toISOString());
    }else{
      console.log("everything is up to date")
    }
  }

  const syncBackend = async () => {
    await pushToBackend()
    await pullFromBackend()
  }
*/