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

  async function renameEnsemble(item_id: string, newName: string) {
    await db.ensemble.update(item_id, { titre: newName });
  }

  const pullFromBackend = async () => {
    const lastSync = await getLastSyncTime();
    const response = await api.get(`/ensembles/pull/?since=${lastSync}`)
    const updated = await response?.data
    for (const item of updated) {
        await db.ensemble.put(item)
    }
    await setLastSyncTime(new Date().toISOString());
  }
  const pushToBackend = async () => {
    // 2. Push local vers backend
    console.log("pushToBackend")
    let localDirty = await db.ensemble.where('dirty').equals(1).toArray();
    if (localDirty.length > 0) {
      console.log("localDirty:", localDirty)
      await api.post('/ensembles/push/', localDirty);
      // Marque comme propre
      await Promise.all(localDirty.map(item =>
        db.ensemble.update(item.id, { dirty: 0})
      ));
    }
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
