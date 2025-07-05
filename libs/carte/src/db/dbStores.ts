// stores/useEnsembleStore.ts
// stores/useEnsembleStore.ts
import { computed } from 'vue'
import { useTableStore } from './useTableStore'

import { db } from './dbApp'
import { EnsembleModel, PinModel, RouteModel } from './dbModels'
import type { PinInRouteType, FamilyTreeType} from './dbTypes/db-items'

// Crée les 3 stores
const typeTableStore = useTableStore(db.typeTable)
const ensembleStore = useTableStore( db.ensembles,EnsembleModel)
const pinStore = useTableStore(db.pins,PinModel)
const routeStore = useTableStore(db.routes, RouteModel)
const pinInRouteStore = useTableStore(db.pinInRoutes)
const familyTreeStore = useTableStore(db.familyTrees)


// Installe les hooks une seule fois
typeTableStore.createHooks()
ensembleStore.createHooks()
pinStore.createHooks()
routeStore.createHooks()
pinInRouteStore.createHooks()
familyTreeStore.createHooks()


// Combinaison items
const JoinedList = computed(() => [
  ...pinStore.list.value,
  ...routeStore.list.value,
  ...ensembleStore.list.value,
])


export function useDBStore() {
  // Charge à la volée les données
  typeTableStore.loadAll()
  ensembleStore.loadAll()
  pinStore.loadAll()
  routeStore.loadAll()
  pinInRouteStore.loadAll()
  familyTreeStore.loadAll()

  const get = (id: string) => {
    return pinStore.dict[id]?? routeStore.dict[id]?? ensembleStore.dict[id]
  }

  return {
    ensembleDict   : ensembleStore.dict,
    pinDict        : pinStore.dict,
    routeDict      : routeStore.dict,
    pinInRouteDict : pinInRouteStore.dict,
    familyTreeDict: familyTreeStore.dict,
    typeTableDict: typeTableStore.dict,
    
    ensembleList: ensembleStore.list,
    pinList: pinStore.list,
    routeList: routeStore.list,
    pinInRouteList: pinInRouteStore.list,
    familyTreeList: familyTreeStore.list,
    typeTableList: typeTableStore.list,
    JoinedList,
    get
  }
}
