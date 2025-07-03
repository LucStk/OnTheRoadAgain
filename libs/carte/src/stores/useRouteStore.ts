// stores/useRouteStore.ts
import { reactive } from 'vue'
import { db } from '../db/appDB'
import { type Route } from "../types/db-types.ts";

const routeDict = reactive<Record<string, Route>>({})

async function loadAllRoutes() {
  const all = await db.routes.toArray()
  for (const route of all) {
    routeDict[route.id] = route
  }
}

db.routes.hook('creating', (_, obj, tx) => {
  tx.on('complete', () => {
    routeDict[obj.id] = obj
  })
})

db.routes.hook('updating', (mods, key, _, tx) => {
  tx.on('complete', () => {
    Object.assign(routeDict[key as string], mods)
  })
})

db.routes.hook('deleting', (key, _, tx) => {
  tx.on('complete', () => {
    delete routeDict[key as string]
  })
})

export function useRouteStore() {
  return {
    routes: routeDict,
    loadAllRoutes,
    getRouteById: (id: string) => routeDict[id],
  }
}
