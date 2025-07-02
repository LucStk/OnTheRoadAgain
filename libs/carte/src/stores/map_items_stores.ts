// stores/map_stores.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {api, useAuthStore} from '@repo/auth';

export const useMapItemsStore = defineStore('mapItems', ()  => {
  let _ensembles = ref<any[]>([]);
  let _pins = ref<any[]>([]);
  let _routes = ref<any[]>([]);

  const auth = useAuthStore()

  async function fetchEnsembles() {
    if (auth.isUserLoaded) { 
      const ret = await api.get("/ensembles/close_ensemble/")
      if (ret.status === 200) {
      ret.data.features.forEach((e: any) => {
        _ensembles.value.push(e)
      })
    }} 
  }
  return {};
});
