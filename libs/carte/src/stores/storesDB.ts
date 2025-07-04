// stores/useEnsembleStore.ts
import { reactive, computed } from 'vue'
import { db, EnsembleClass,PinClass, RouteClass } from '../db/appDB.ts'
import { type Table } from 'dexie'
const ensembleDict = reactive<Record<string, EnsembleClass>>({})
const pinDict = reactive<Record<string, PinClass>>({})
const routeDict = reactive<Record<string, RouteClass>>({})

async function loadAll(
    dbtable :Table<any, string, any> ,
    dict: Record<string, any>,
    classe: any) {
  const all = await dbtable.toArray()
  for (const obj of all) {
    dict[obj.id] = new classe(obj)
  }
}


// Hooks pour joindre les changements de la base de données à la vue
function createhooks( 
    dbtable :Table<any, string, any> ,
    dict: Record<string, any>,
    classe: any
) {
  dbtable.hook('creating', (_, obj, tx) => {
    tx.on('complete', () => {
      dict[obj.id] = new classe(obj)
    })
  })
  dbtable.hook('updating', (mods, key, _, tx) => {
    tx.on('complete', () => {
      Object.assign(dict[key as string], mods)
    })
  })
  dbtable.hook('deleting', (key, _, tx) => {
    tx.on('complete', () => {
      delete dict[key as string]
    })
  })
}

createhooks(db.ensembles, ensembleDict, EnsembleClass)
createhooks(db.pins, pinDict, PinClass)
createhooks(db.routes, routeDict, RouteClass)

const ensembleList = computed(() => Object.values(ensembleDict))
const pinList = computed(() => Object.values(pinDict))
const routeList = computed(() => Object.values(routeDict))
const itemsList = computed<(PinClass | RouteClass)[]>(() => [
      ...Object.values(pinDict), 
      ...Object.values(routeDict)])

export function useDBStore() {
  loadAll(db.ensembles, ensembleDict, EnsembleClass)
  loadAll(db.pins, pinDict, PinClass)
  loadAll(db.routes, routeDict, RouteClass)

  return {
    ensembles: ensembleDict,
    pins: pinDict,
    routes: routeDict,
    itemsList,
    ensembleList,
    pinList,
    routeList,
    get: (id: string) => ensembleDict[id],
  }
}
