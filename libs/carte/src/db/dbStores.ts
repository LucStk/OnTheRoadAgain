// stores/useEnsembleStore.ts
// stores/useEnsembleStore.ts
import { computed } from 'vue'
import { useTableStore } from './useTableStore'

import { db } from './dbApp'
import { EnsembleModel, PinModel, RouteModel } from './dbModels'
import type { PinInRouteType, ItemInEnsembleType} from './dbTypes/Classes'

// Crée les 3 stores
const ensembleStore = useTableStore( db.ensembles,EnsembleModel)
const pinStore = useTableStore(db.pins,PinModel)
const routeStore = useTableStore(db.routes, RouteModel)
const pinInRouteStore = useTableStore(db.pinInRoutes)
const itemInEnsembleStore = useTableStore(db.itemInEnsembles)

// Installe les hooks une seule fois
ensembleStore.createHooks()
pinStore.createHooks()
routeStore.createHooks()
pinInRouteStore.createHooks()
itemInEnsembleStore.createHooks()

// Combinaison items
const itemsList = computed(() => [
  ...pinStore.list.value,
  ...routeStore.list.value,
])

export function useDBStore() {
  // Charge à la volée les données
  ensembleStore.loadAll()
  pinStore.loadAll()
  routeStore.loadAll()
  pinInRouteStore.loadAll()
  itemInEnsembleStore.loadAll()

  return {
    ensembleDict   : ensembleStore.dict,
    pinDict        : pinStore.dict,
    routeDict      : routeStore.dict,
    pinInRouteDict : pinInRouteStore.dict,
    itemInEnsembleDict: itemInEnsembleStore.dict,

    itemsList,
    
    ensembleList: ensembleStore.list,
    pinList: pinStore.list,
    routeList: routeStore.list,
    pinInRouteList: pinInRouteStore.list,
    itemInEnsembleList: itemInEnsembleStore.list,

    get: (id: string) => ensembleStore.dict[id],
  }
}
