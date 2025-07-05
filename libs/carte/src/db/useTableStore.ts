// stores/useTableStore.ts
import { reactive, computed, type ComputedRef } from 'vue'
import { type Table } from 'dexie'

export function useTableStore<T extends object, TM extends T>(
  dbtable: Table<T, string>,
  Model?: new (data?: Partial<T>) => TM,
) {
  const dict = reactive<Record<string, T>>({})
  const list = computed(() => Object.values(dict)) as ComputedRef<TM[]>
  
  if (Model) {
    dbtable.mapToClass(Model)
  }

  async function loadAll() {
    const all = await dbtable.toArray()
    for (const obj of all) {
      dict[(obj as any).id] = obj // déjà instancié
    }
  }

  function createHooks() {
    dbtable.hook('creating', (_, obj, tx) => {
      tx.on('complete', () => {
        dict[(obj as any).id] = Model ? new Model(obj) : obj
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
