// stores/useEnsembleStore.ts
// stores/useEnsembleStore.ts
import { computed } from 'vue'
import { useTableStore } from './useTableStore'

import { db } from './dbApp'
import { EnsembleModel, PinModel, RouteModel } from './dbModels'

// Crée les 3 stores
const ensembleStore = useTableStore(EnsembleModel, db.ensembles)
const pinStore = useTableStore(PinModel, db.pins)
const routeStore = useTableStore(RouteModel, db.routes)

// Installe les hooks une seule fois
ensembleStore.createHooks()
pinStore.createHooks()
routeStore.createHooks()

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

  return {
    ensembles: ensembleStore.dict,
    pins: pinStore.dict,
    routes: routeStore.dict,
    itemsList,
    ensembleList: ensembleStore.list,
    pinList: pinStore.list,
    routeList: routeStore.list,
    get: (id: string) => ensembleStore.dict[id],
  }
}
