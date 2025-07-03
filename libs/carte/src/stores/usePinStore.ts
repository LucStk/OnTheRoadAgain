import { reactive } from 'vue'
import { db, type Pin } from '../db/appDB'
import { PinClass } from '../db/appDB'

const pinDict = reactive<Record<string, PinClass>>({})

async function loadAllPins() {
  const pins = await db.pins.toArray()
  for (const pin of pins) {
    pinDict[pin.id] = pin
  }
}

db.pins.hook('creating', (_, obj, tx) => {
  tx.on('complete', () => {
    pinDict[obj.id] = obj as PinClass
  })
})

db.pins.hook('updating', (mods, key, obj, tx) => {
  tx.on('complete', () => {
    Object.assign(pinDict[key as string], mods)
  })
})

db.pins.hook('deleting', (key, _, tx) => {
  tx.on('complete', () => {
    delete pinDict[key as string]
  })
})

export function usePinStore() {
  return {
    pins: pinDict,
    loadAllPins,
    getPinById: (id: string) => pinDict[id],
  }
}
