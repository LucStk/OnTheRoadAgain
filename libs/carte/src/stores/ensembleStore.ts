// stores/useEnsembleStore.ts
import { reactive, computed } from 'vue'
import { db, EnsembleClass,PinClass, RouteClass } from '../db/appDB.ts'
import { type Table } from 'dexie'
const ensembleDict = reactive<Record<string, EnsembleClass>>({})
const pinDict = reactive<Record<string, PinClass>>({})
const routeDict = reactive<Record<string, RouteClass>>({})

async function loadAllEnsembles() {
  const all = await db.ensembles.toArray()
  for (const obj of all) {
    ensembleDict[obj.id] = new EnsembleClass(obj)
  }
}
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
const pinList = computed(() => Object.values(ensembleDict))
const routeList = computed(() => Object.values(ensembleDict))
export function useEnsembleStore() {
  return {
    ensembles: ensembleDict,
    pins: pinDict,
    routes: routeDict,
    ensembleList,
    pinList,
    routeList,
    loadAllEnsembles,
    get: (id: string) => ensembleDict[id],
  }
}
