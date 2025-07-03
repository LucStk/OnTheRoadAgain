import Dexie, { type Table } from 'dexie';
import 'dexie-relationships'; // il faut l'importer pour activer le plugin
import { type Pin, type Route, type Ensemble, type BaseInterface } from "../types/db-types.ts";
import { api } from '@repo/auth';
import { setLastSyncTime, getLastSyncTime} from '../db/syncMetaDB';

abstract class BaseModel implements BaseInterface {
  id!: string;
  user!: string;
  titre!: string;
  description!: string;
  created_at!: string;
  updated_at!: string;
  dirty!: number;
  is_deleted!: number;
  type!: 'ensemble' | 'pin' | 'route';

  constructor(data?: Partial<BaseInterface>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  abstract getTable(): Table<any, string, any>;

  async update(data: Partial<this>) {
    const now = new Date().toISOString();
    Object.assign(this, data, {
      updated_at: now,
      dirty: 1
    });
    if (this.id === undefined) {
      throw new Error('AppDB Error : Cannot update object without an ID');
    }

    await this.getTable().update(this.id, {
      ...data,
      updated_at: now,
      dirty: 1
    });
  }

  static async push<T extends { getTable(): Table<any, string, any> }>(this: T)  {
    // 2. Push local vers backend
    const dbtable = this.getTable();
    //let localDirty = await dbtable.where('dirty').equals(1).toArray();
    let localDirty = await dbtable.toArray();
    if (localDirty.length > 0) {
      const response = await api.post('/sync/push/', localDirty);
      console.log("response:", response)
      // Marque comme propre
      
      await Promise.all(response.data.map((item: BaseModel) =>{
        if (item.is_deleted) {
          dbtable.delete(item.id)
        }
        dbtable.update(item.id, { dirty: 0})
        console.log("push : item.id:", item.id)
      }));
      await setLastSyncTime(new Date().toISOString());
    }else{
      console.log("everything is up to date")
    }
  }

  async save(): Promise<void> {
    const table = this.getTable();
    await table.put(this as any);
  }
  async delete(): Promise<void> {
    const table = this.getTable();
    const lastSync = await getLastSyncTime(); 
    if (new Date(lastSync) < new Date(this.created_at)) {
      // L'objet n'a pas été crée sur le serveur
      await table.delete(this.id);
    }
    else {
      // L'objet a été créé sur le serveur, on dempande la suppression à la prochaine synchronisation
      await table.update(this.id, { is_deleted: 1 });
    }
  }
    // Méthode statique générique pour créer une instance et l'insérer en base
  static async create<T extends BaseModel>(
    this: new (data?: Partial<T>) => T,
    data: Partial<T>
    ): Promise<any> {
      const now = new Date().toISOString();
      const instance = new this({
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
        dirty: 1,
        is_deleted: 0,
        ...data,
    } as Partial<T>);
    await instance.save();
    return instance;
  }
}

export class EnsembleClass extends BaseModel implements Ensemble {
  visibility!: 'C' | 'O';
  is_global!: number;

  constructor(data?: Partial<Ensemble>) {super(data);}

  static async create(data: Partial<Ensemble>): Promise<EnsembleClass> {
    const defaults = {
      type: 'ensemble' as const,
      visibility: 'C' as const,
      is_global: 0,
    };
    return BaseModel.create.call(this, { ...defaults, ...data });
  }


  getTable() {return db.ensembles;}
  static getTable() {return db.ensembles;}
}

export class PinClass  extends BaseModel implements Pin{
  ensemble_fk!: string;
  lnglat!: string;

  constructor(data?: Partial<Pin>) {super(data);}

  static async create(data: Partial<Pin>): Promise<PinClass> {
    const defaults = {
      type: 'pin' as const,
    };
    return BaseModel.create.call(this, { ...defaults, ...data });
  }

  getTable() {return db.pins;}
  static getTable() {return db.pins;}
}

export class RouteClass extends BaseModel  implements Route {
  ensemble_fk!: string;
  geometry!: string;
  bbox!: string;
  origine!: string;
  destination!: string;

  constructor(data?: Partial<Route>) {super(data);}

  static async create(data: Partial<Route>): Promise<RouteClass> {
    const defaults = {
      type: 'route' as const,
    };
    return BaseModel.create.call(this, { ...defaults, ...data });
  }

  getTable() {return db.routes;}
  static getTable() {return db.routes;}
}

export class AppDB extends Dexie {
  ensembles!: Table<Ensemble, string>;
  routes!:    Table<Route, string>;
  pins!:      Table<Pin, string>;

  constructor() {
    super('AppDB');
    this.version(1).stores({
      ensembles : 'id, visibility,  updated_at, dirty',
      pins      : 'id, ensemble_fk, updated_at, dirty',
      routes    : 'id, ensemble_fk, updated_at, dirty'
    });

    this.ensembles.mapToClass(EnsembleClass);
    this.pins.mapToClass(PinClass);
    this.routes.mapToClass(RouteClass);
  }
  async pushChanges() {
    EnsembleClass.push()
    PinClass.push()
    RouteClass.push()
  }

  async pullChanges() {
    const lastSync = await getLastSyncTime();

    // 1. Pull des ensembles
    const response = await api.get(`/sync/pull/?since=${lastSync}`)
    //const response = await api.get(`/sync/pull/`)
    const updated = await response?.data
    console.log("pull : updated.length:", updated.length)
    for (const item of updated) {
        if (!item.type) console.error('Pulled item without type', item)
        switch(item.type) {
          case 'ensemble':
            await this.ensembles.put(item)
            break;
          case 'pin':
            await this.pins.put(item)
            break;
          case 'route':
            await this.routes.put(item)
            break;
          default:
            console.error('Pull : unknown type ' + item.type)
        }
        console.log("pull : item.id:", item.id)
    }
    await setLastSyncTime(new Date().toISOString());
  }

}

export const db = new AppDB();