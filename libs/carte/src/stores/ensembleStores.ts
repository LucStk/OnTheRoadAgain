// stores/ensembleStore.ts
import { from } from 'rxjs'
import { computed, DeprecationTypes, ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { db, type Ensemble } from '../db/ensembleDB'
import { getLastSyncTime, setLastSyncTime } from '../db/syncMetaDB'
import { type IndexableType,liveQuery  } from 'dexie';
import { api } from '@repo/auth';

export const useEnsembleStore = defineStore('ensemble', () => {
  const ensemblesList = ref<Ensemble[]>([])
  const _ensemblesMap = ref<Record<string, Ensemble>>({})
  const ensemblesMap = computed(() => {
    return _ensemblesMap.value
  })

  const loading = ref(false)

  // LiveQuery qui retourne un Observable RxJS
  const liveEnsembles$ = from(liveQuery(() => db.ensemble.toArray()))

  // Synchronisation live de la base Dexie vers le store
  watchEffect((onInvalidate) => {
    const subscription = liveEnsembles$.subscribe({
      next(data) {
        ensemblesList.value = data
        // Transformer en dictionnaire
        _ensemblesMap.value = data.reduce((acc, item) => {
          acc[String(item.id)] = item
          return acc
        }, {} as Record<string, Ensemble>)
        loading.value = false

      },
      error(err) {
        console.error('Erreur liveQuery:', err)
      }
    })

    onInvalidate(() => subscription.unsubscribe())
  })

  function now() {return new Date().toISOString();}

  async function renameEnsemble(item_id: string, newName: string) {
    await updateEnsemble(item_id, { titre: newName });
  }

  async function updateEnsemble(items_id: string, items: Partial<Ensemble>) {
    const _items = {
      ...items,
      updated_at: now(),
      dirty: 1
    };
    await db.ensemble.update(items_id, _items)
  }

  const pullFromBackend = async () => {
    const lastSync = await getLastSyncTime();
    const response = await api.get(`/ensembles/pull/?since=${lastSync}`)
    const updated = await response?.data
    for (const item of updated) {
        await db.ensemble.put(item)
        console.log("pull : item.id:", item.id)
    }
    await setLastSyncTime(new Date().toISOString());
  }

  const pushToBackend = async () => {
    // 2. Push local vers backend
    let localDirty = await db.ensemble.where('dirty').equals(1).toArray();
    if (localDirty.length > 0) {
      const response = await api.post('/ensembles/push/', localDirty);
      console.log("response:", response)
      // Marque comme propre
      
      await Promise.all(response.data.map((item: Ensemble) =>{
        db.ensemble.update(item.id, { dirty: 0})
        console.log("push : item.id:", item.id)
      }));
      await setLastSyncTime(new Date().toISOString());
    }else{
      console.log("everything is up to date")
    }
  }

  const syncBackend = async () => {
    await pushToBackend()
    await pullFromBackend()
  }

  async function createLocalEnsemble() {
    const visibility: 'C' | 'O' | 'R' = 'C';

    const ensemble = {
      id: crypto.randomUUID(), // UUID temporaire
      titre: 'Nouvel ensemble local',
      description: 'Créé hors-ligne',
      visibility,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      dirty : 1,
      deleted : 0
    }
    await db.ensemble.add(ensemble)
    return ensemble.id
  }

  const deleteEnsemble = async (id: string) => {
    await db.ensemble.delete(id)
  }

  const clear = async () => {
    await db.ensemble.clear()
  }

  return {
    ensemblesList ,
    ensemblesMap,
    loading,
    pullFromBackend,
    pushToBackend,
    createLocalEnsemble,
    renameEnsemble,
    deleteEnsemble,
    clear,
  }
})
