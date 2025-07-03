import Dexie, { type Table } from 'dexie';
import 'dexie-relationships'; // il faut l'importer pour activer le plugin
import { type Pin, type Route, type Ensemble, type BaseInterface } from "../types/db-types.ts";


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

  abstract getTable(): any;

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

  async save(): Promise<void> {
    const table = this.getTable();
    await table.put(this as any);
  }
  async delete(): Promise<void> {
    const table = this.getTable();
    await table.delete(this.id);
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
}

export class PinClass  extends BaseModel implements Pin{
  ensemble_fk!: string;
  lnglat!: string;

  getTable() {return db.pins;}
}

export class RouteClass extends BaseModel  implements Route {
  ensemble_fk!: string;
  geometry!: string;
  bbox!: string;
  origine!: string;
  destination!: string;

  getTable() {return db.routes;}
}

export class AppDB extends Dexie {
  ensembles!: Table<Ensemble, string>;
  routes!:    Table<Route, string>;
  pins!:      Table<Pin, string>;

  constructor() {
    super('AppDB');
    this.version(1).stores({
      ensembles : 'id, visibility, updated_at, dirty',
      pins      : 'id, ensemble_fk, updated_at, dirty',
      routes    : 'id, ensemble_fk, updated_at, dirty'
    });

    this.ensembles.mapToClass(EnsembleClass);
    this.pins.mapToClass(PinClass);
    this.routes.mapToClass(RouteClass);
  }
}

export const db = new AppDB();