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

  // Live queries (comme avant)
  liveQuery(() => db.baseSyncObjects.toArray()).subscribe({
    next: result => baseSyncObjects.value = result,
    error: e => console.error('liveQuery baseSyncObjects error:', e),
  })
  liveQuery(() => db.ensembles.toArray()).subscribe({
    next: result => ensembles.value = result,
    error: e => console.error('liveQuery ensembles error:', e),
  })
  liveQuery(() => db.pins.toArray()).subscribe({
    next: result => pins.value = result,
    error: e => console.error('liveQuery pins error:', e),
  })
  liveQuery(() => db.routes.toArray()).subscribe({
    next: result => routes.value = result,
    error: e => console.error('liveQuery routes error:', e),
  })

  

  const enrichedObjects = computed(() => {
    return baseSyncObjects.value.map(bso => {
      if (bso.type === 'ensemble') {
        const ensemble = ensembles.value.find(e => e.id === bso.id)
        return { ...bso, ensemble }
      }
      if (bso.type === 'pin') {
        const pin = pins.value.find(p => p.id === bso.id)
        return { ...bso, pin }
      }
      if (bso.type === 'route') {
        const route = routes.value.find(r => r.id === bso.id)
        return { ...bso, route }
      }
      return bso
    })
  })

  const getObject = computed(() => {
    return (id: string) => {

  // --- Fonctions CRUD ---

  async function addObject(data: Partial<BaseSyncObject> & Partial<Ensemble | Pin | Route>) {
    const id = data.id ?? crypto.randomUUID()
    const nowIso = new Date().toISOString()

    const baseData: BaseSyncObject = {
      id,
      user: data.user ?? '',
      titre: data.titre ?? '',
      description: data.description ?? '',
      created_at: nowIso,
      updated_at: nowIso,
      dirty: 1,
      is_deleted: 0,
      type: data.type!,
    }

    await db.transaction('rw', db.baseSyncObjects, db.ensembles, db.pins, db.routes, async () => {
      await db.baseSyncObjects.add(baseData)

      switch(baseData.type) {
        case 'ensemble':
          await db.ensembles.add({
            id,
            is_global: (data as Ensemble).is_global ?? 0,
            visibility: (data as Ensemble).visibility ?? 'C',
          })
          break;
        case 'pin':
          await db.pins.add({
            id,
            ensemble_fk: (data as Pin).ensemble_fk ?? '',
            lnglat: (data as Pin).lnglat ?? '',
          })
          break;
        case 'route':
          await db.routes.add({
            id,
            ensemble_fk: (data as Route).ensemble_fk ?? '',
            geometry: (data as Route).geometry ?? '',
            bbox: (data as Route).bbox ?? '',
            origine: (data as Route).origine ?? '',
            destination: (data as Route).destination ?? '',
          })
          break;
      }
    })

    return id
  }

  async function updateObject(id: string, data: Partial<BaseSyncObject> & Partial<Ensemble | Pin | Route>) {
    const nowIso = new Date().toISOString()

    // Prépare update base
    const baseUpdateFields: Partial<BaseSyncObject> = {
      ...('user' in data ? { user: data.user! } : {}),
      ...('titre' in data ? { titre: data.titre! } : {}),
      ...('description' in data ? { description: data.description! } : {}),
      updated_at: nowIso,
      dirty: 0,
    }

    await db.transaction('rw', db.baseSyncObjects, db.ensembles, db.pins, db.routes, async () => {
      await db.baseSyncObjects.update(id, baseUpdateFields)

      // Récupère l'objet baseSyncObject pour savoir son type
      const baseObj = await db.baseSyncObjects.get(id)
      if (!baseObj) throw new Error('Objet non trouvé pour update')

      switch(baseObj.type) {
        case 'ensemble':
          const ensembleFields: Partial<Ensemble> = {}
          if ('is_global' in data) ensembleFields.is_global = (data as Ensemble).is_global
          if ('visibility' in data) ensembleFields.visibility = (data as Ensemble).visibility
          if (Object.keys(ensembleFields).length) {
            await db.ensembles.update(id, ensembleFields)
          }
          break
        case 'pin':
          const pinFields: Partial<Pin> = {}
          if ('ensemble_fk' in data) pinFields.ensemble_fk = (data as Pin).ensemble_fk
          if ('lnglat' in data) pinFields.lnglat = (data as Pin).lnglat
          if (Object.keys(pinFields).length) {
            await db.pins.update(id, pinFields)
          }
          break
        case 'route':
          const routeFields: Partial<Route> = {}
          if ('ensemble_fk' in data) routeFields.ensemble_fk = (data as Route).ensemble_fk
          if ('geometry' in data) routeFields.geometry = (data as Route).geometry
          if ('bbox' in data) routeFields.bbox = (data as Route).bbox
          if ('origine' in data) routeFields.origine = (data as Route).origine
          if ('destination' in data) routeFields.destination = (data as Route).destination
          if (Object.keys(routeFields).length) {
            await db.routes.update(id, routeFields)
          }
          break
      }
    })
  }

  async function deleteObject(id: string) {
    await db.transaction('rw', db.baseSyncObjects, db.ensembles, db.pins, db.routes, async () => {
      // Supprime d'abord les enfants selon type
      const baseObj = await db.baseSyncObjects.get(id)
      if (!baseObj) throw new Error('Objet non trouvé pour suppression')

      switch(baseObj.type) {
        case 'ensemble':
          await db.ensembles.delete(id)
          break
        case 'pin':
          await db.pins.delete(id)
          break
        case 'route':
          await db.routes.delete(id)
          break
      }
      // Supprime l'objet baseSyncObject
      await db.baseSyncObjects.delete(id)
    })
  }



  // --- PUSH : envoi des changements locaux vers le serveur ---
  async function pushChanges() {
    // Récupérer tous les objets "dirty"
    const dirtyObjects = await db.baseSyncObjects.where('dirty').equals(1).toArray()

    if (dirtyObjects.length === 0) {
      console.log('Aucun changement à pousser')
      return
    }

    try {
      // Envoyer au serveur (exemple POST avec axios)
      // Ici on suppose que ton backend accepte un tableau d'objets à sync
      const response = await api.post('/sync/push', dirtyObjects)

      // Si push OK, mettre à jour dirty = 0 localement
      const updatedIds = response.data.updatedIds as string[] // ids confirmés par le serveur

      await db.transaction('rw', db.baseSyncObjects, async () => {
        for (const id of updatedIds) {
          await db.baseSyncObjects.update(id, { dirty: 0 })
        }
      })

      console.log(`${updatedIds.length} objets poussés et marqués à jour.`)
    } catch (err) {
      console.error('Erreur lors du push :', err)
    }
  }

  // --- PULL : récupérer les objets depuis le serveur ---
  async function pullChanges() {
    try {
      // Exemple : récupérer tous les objets modifiés sur serveur depuis la dernière synchro
      // Tu peux gérer une date de dernière synchro en local pour optimiser
      const response = await api.get<BaseSyncObject[]>('/sync/pull')

      const serverObjects = response.data

      await db.transaction('rw', db.baseSyncObjects, db.ensembles, db.pins, db.routes, async () => {
        for (const obj of serverObjects) {
          // Met à jour ou ajoute l'objet baseSyncObject
          await db.baseSyncObjects.put({ ...obj, dirty: 0 })

          // Met à jour ou ajoute les tables enfants selon le type
          switch(obj.type) {
            case 'ensemble':
              const ensembleData = obj as unknown as Ensemble
              await db.ensembles.put(ensembleData)
              break
            case 'pin':
              const pinData = obj as unknown as Pin
              await db.pins.put(pinData)
              break
            case 'route':
              const routeData = obj as unknown as Route
              await db.routes.put(routeData)
              break
          }
        }
      })

      console.log(`${serverObjects.length} objets synchronisés depuis le serveur.`)
    } catch (err) {
      console.error('Erreur lors du pull :', err)
    }
  }


  return {
    baseSyncObjects,
    ensembles,
    pins,
    routes,
    enrichedObjects,
    addObject,
    updateObject,
    deleteObject,
    pushChanges,
    pullChanges,
  }
})