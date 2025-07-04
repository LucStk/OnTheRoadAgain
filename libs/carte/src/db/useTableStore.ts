// stores/useTableStore.ts
import { reactive, computed } from 'vue'
import { type Table } from 'dexie'

export function useTableStore<T extends object>(
  Model: new (data?: Partial<T>) => T,
  dbtable: Table<T, string>
) {
  const dict = reactive<Record<string, T>>({})
  const list = computed(() => Object.values(dict))
  dbtable.mapToClass(Model)

  async function loadAll() {
    const all = await dbtable.toArray()
    for (const obj of all) {
      dict[(obj as any).id] = obj // déjà instancié
    }
  }

  function createHooks() {
    dbtable.hook('creating', (_, obj, tx) => {
      tx.on('complete', () => {
        dict[(obj as any).id] = new Model(obj)
      })
    })
    dbtable.hook('updating', (mods, key, _, tx) => {
      tx.on('complete', () => {
        Object.assign(dict[key as string], mods)
      })
    })
    dbtable.hook('deleting', (key, _, tx) => {
      tx.on('complete', () => {
        delete dict[key as string]
      })
    })
  }

  return {
    dict,
    list,
    loadAll,
    createHooks,
  }
}
