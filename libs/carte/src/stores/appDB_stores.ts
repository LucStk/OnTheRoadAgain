import { defineStore } from 'pinia'
import { liveQuery } from 'dexie'
import { ref, computed } from 'vue'
import { db, type BaseSyncObject, type Ensemble, type Pin, type Route} from "../db/appDB"
import { api } from '@repo/auth'

export const useSyncStore = defineStore('sync', () => {
  const baseSyncObjects = ref<BaseSyncObject[]>([])
  const ensembles = ref<Ensemble[]>([])
  const pins = ref<Pin[]>([])
  const routes = ref<Route[]>([])



  return {
    baseSyncObjects,
    ensembles,
    pins,
    routes,
  }
})