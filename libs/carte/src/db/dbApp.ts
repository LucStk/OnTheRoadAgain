import type { PinInRouteType,FamilyTreeType, EnsembleType, RouteType, PinType, TypeTable } from './dbTypes/db-items';
import { api } from '@repo/auth';
import { setLastSyncTime, getLastSyncTime} from './syncMetaDB.ts';
import Dexie,{ type Table } from 'dexie';
import type { BaseModelShape } from './dbTypes/withBase.Model.d.ts';


async function push(dbtable: Table<any, string, any>){
  // 2. Push local vers backend
  let localDirty = await dbtable.where('dirty').equals(1).toArray();
  //let localDirty = await dbtable.toArray(); // Pour test
  if (localDirty.length > 0) {
    const response = await api.post('/sync/push/', localDirty);
    console.log("response:", response)
    // Marque comme propre
    
    await Promise.all(response.data.map((item: BaseModelShape) =>{
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

export class AppDB extends Dexie {
  ensembles!: Table<EnsembleType, string>;
  routes!: Table<RouteType, string>;
  pins!: Table<PinType, string>;
  pinInRoutes!: Table<PinInRouteType, string>;
  familyTrees!: Table<FamilyTreeType, string>;
  typeTable!: Table<TypeTable, string>;

  constructor() {
    super('AppDB');

    this.version(2).stores({
      ensembles: 'id, visibility, updated_at, dirty',
      pins: 'id, updated_at, dirty',
      routes: 'id, updated_at, dirty',
      pinInRoutes: 'id, route_id, pin_id, order',
      familyTrees: 'id, child_id, parent_id, order',
      typeTable: 'id, type'
    });
  }

  async pushChanges() {
    push(this.ensembles);
    push(this.pins);
    push(this.routes);
    // Relations ne sont pas encore gérées par le backend ici (à ajouter plus tard si besoin)
  }

  async pullChanges() {
    const lastSync = await getLastSyncTime();
    const response = await api.get(`/sync/pull/?since=${lastSync}`);
    const updated = await response?.data;

    for (const item of updated) {
      switch(item.type) {
        case 'ensemble':
          await this.ensembles.put(item);
          break;
        case 'pin':
          await this.pins.put(item);
          break;
        case 'route':
          await this.routes.put(item);
          break;
        default:
          console.warn("Unknown type during pull:", item);
      }
    }

    await setLastSyncTime(new Date().toISOString());
  }
}

export const db = new AppDB();
