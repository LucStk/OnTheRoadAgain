import { describe, it, expect, vi, beforeEach } from 'vitest'
import {LngLatLike} from 'maplibre-gl'
import { useMapStore} from '../src/stores/map_stores'
import { api, useAuthStore } from '@repo/auth'
import { createPinia, setActivePinia } from 'pinia'

async function removeAllPins() {
  const res = await api.get("/ensembles/")
  expect(res.status).toBe(200)
  await res.data.forEach((e: any) => {
    api.delete("/ensembles/" + e.id + "/")
    console.log("delete ensemble : ", e.id)
  })
}

describe('API user création', () => {
    beforeEach(() => {
    // Initialise un nouveau contexte Pinia avant chaque test
    setActivePinia(createPinia())
  
  })

  it('Test créer un ensemble', async () => {
    const data = { email: "alice@example.com", password: "alicepassword" }
    const auth = useAuthStore()
    try {
      let res = await auth.login(data.email, data.password)
      expect(res).toBe(true)

      const d = {
        "titre": "New Ensemble",
        "description": "Ensemble 1 description",
      }
      const res2 = await api.post("/ensembles/", d)
      expect(res2.status).toBe(201)

      let id = res2.data.id

      const res4 = await api.get("/ensembles/" + id + "/")
      expect(res4.status).toBe(200)

      const res5 = await api.delete("/ensembles/" + id + "/")
      console.log('Success:', res5)
      expect(res5.status).toBe(204)
    }
    catch (error: any) {
      // Axios met la réponse dans error.response
      console.error('Erreur API:', 
              error.response?.status, 
              error.response?.data)
      throw error  // pour que Vitest sache que le test échoue
    } finally {
      await removeAllPins()
    }
  });

  it('Test créer un point dans un ensemble', async () => {
    const data = { email: "alice@example.com", password: "alicepassword" }
    const auth = useAuthStore()
    try {
      let res = await auth.login(data.email, data.password)
      expect(res).toBe(true)
      const d = {
        "titre": "New Ensemble",
        "description": "Ensemble 1 description",
      }
      const res2 = await api.post("/ensembles/", d)
      expect(res2.status).toBe(201)

      let id = res2.data.id

      const res3 = await api.post("/ensembles/close_ensemble/pins/", {
        "latlng": {
          "type": "Point",
          "coordinates": [48.41040274663766,-4.49993133544922, ]
        },
        "title": "New Pin",
        "description": "Pin 1 description",
      })
      console.log('ID pins :', res3.data.id)
      expect(res3.status).toBe(201)
      
      const res4 = await api.get("/ensembles/close_ensemble/pins/")
      console.log('Success:', res4)
      expect(res4.status).toBe(200)

    }
    catch (error: any) {
      // Axios met la réponse dans error.response
      console.error('Erreur API:', 
              error.response?.status, 
              error.response?.data)
      throw error  // pour que Vitest sache que le test échoue
    } finally {
      await removeAllPins()
    }
  });

})


describe('PinMarker', () => {
  let map: any;
  let pointsRef: { value: LngLatLike[] };

  beforeEach(() => {
    pointsRef = { value: [] };
  });
});
