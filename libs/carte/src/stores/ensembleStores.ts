// stores/ensembleStore.ts
import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { computed, ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { db, type Ensemble } from '../db/ensembleDB'


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

  const addOrUpdateEnsemble = async (item: Ensemble) => {
    await db.ensemble.put(item)
  }

  async function renameEnsemble(item_id: string, newName: string) {
    await db.ensemble.update(item_id, { titre: newName });
  }


  const syncWithBackend = async () => {
    const lastSync = localStorage.getItem('last_sync') || '1970-01-01T00:00:00Z'
    const response = await fetch(`/api/ensembles?updated_after=${lastSync}`)
    const updated = await response.json()
    for (const item of updated) {
        await db.ensemble.put(item)
    }
    localStorage.setItem('last_sync', new Date().toISOString())
  }

  async function createLocalEnsemble() {
    const ensemble = {
      id: crypto.randomUUID(), // UUID temporaire
      titre: 'Nouvel ensemble local',
      description: 'Créé hors-ligne',
      visibility: 'Close',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
    createLocalEnsemble,
    syncWithBackend,
    addOrUpdateEnsemble,
    renameEnsemble,
    deleteEnsemble,
    clear,
  }
})
