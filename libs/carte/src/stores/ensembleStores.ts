// stores/ensembleStore.ts
import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { db, type Ensemble } from '../db/ensembleDB'


export const useEnsembleStore = defineStore('ensemble', () => {
  const ensembles = ref<Ensemble[]>([])
  const loading = ref(false)

  // liveQuery retourne un Observable RxJS, on convertit en Vue reactivity via watchEffect
  const liveEnsembles$ = from(liveQuery(() => db.ensemble.toArray()))

  // Abonnement pour mettre à jour ensembles réactivement
  watchEffect((onInvalidate) => {
    const subscription = liveEnsembles$.subscribe({
      next(data) {
        ensembles.value = data
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

  const syncWithBackend = async () => {
    const lastSync = localStorage.getItem('last_sync') || '1970-01-01T00:00:00Z'
    const response = await fetch(`/api/ensembles?updated_after=${lastSync}`)
    const updated = await response.json()
    for (const item of updated) {
        await db.ensemble.put(item)
    }
    localStorage.setItem('last_sync', new Date().toISOString())
  }

  const createLocalEnsemble = async () => {
    const ensemble = {
      id: crypto.randomUUID(), // UUID temporaire
      titre: 'Nouvel ensemble local',
      description: 'Créé hors-ligne',
      visibility: 'Close',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await db.ensemble.add(ensemble)
  }

  const deleteEnsemble = async (id: string) => {
    await db.ensemble.delete(id)
  }

  const clear = async () => {
    await db.ensemble.clear()
  }

  return {
    ensembles,
    loading,
    createLocalEnsemble,
    syncWithBackend,
    addOrUpdateEnsemble,
    deleteEnsemble,
    clear,
  }
})
