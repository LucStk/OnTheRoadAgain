// stores/useEnsembleStore.ts
import { reactive, computed } from 'vue'
import { db, EnsembleClass } from '../db/appDB.ts'

const ensembleDict = reactive<Record<string, EnsembleClass>>({})

async function loadAllEnsembles() {
  const all = await db.ensembles.toArray()
  for (const obj of all) {
    ensembleDict[obj.id] = new EnsembleClass(obj)
  }
}


db.ensembles.hook('creating', (_, obj, tx) => {
  tx.on('complete', () => {
    ensembleDict[obj.id] = new EnsembleClass(obj)
  })
})

db.ensembles.hook('updating', (mods, key, _, tx) => {
  tx.on('complete', () => {
    Object.assign(ensembleDict[key as string], mods)
  })
})

db.ensembles.hook('deleting', (key, _, tx) => {
  tx.on('complete', () => {
    delete ensembleDict[key as string]
  })
})

const ensembleList = computed(() => Object.values(ensembleDict))

export function useEnsembleStore() {
  return {
    ensembles: ensembleDict,
    ensembleList,
    loadAllEnsembles,
    get: (id: string) => ensembleDict[id],
  }
}
