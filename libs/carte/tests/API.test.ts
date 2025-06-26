import { describe, it, expect, vi, beforeEach } from 'vitest'
import {LngLatLike} from 'maplibre-gl'
import { useMapStore} from '../src/stores/map_stores'
import { api, useAuthStore } from '@repo/auth'
import { createPinia, setActivePinia } from 'pinia'

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
        "id": 1,
        "name": "Ensemble 1",
        "description": "Ensemble 1 description",
      }
      const res2 = await api.post("/ensembles/", d)
      console.log('Success:', res2)
      expect(res2.status).toBe(201)

      const res3 = await api.get("/ensembles/")
      console.log('Success:', res3)
      expect(res3.status).toBe(200)


      await res3.data.forEach((e: any) => {
        api.delete("/ensembles/" + e.id + "/")
      })

      const res4 = await api.get("/ensembles/3/")
      console.log('Success:', res4)
      expect(res4.status).toBe(200)


      const res5 = await api.delete("/ensembles/1/")
      console.log('Success:', res5)
      expect(res5.status).toBe(204)
    }
    catch (error: any) {
      // Axios met la réponse dans error.response
      console.error('Erreur API:', 
              error.response?.status, 
              error.response?.data)
      throw error  // pour que Vitest sache que le test échoue
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
