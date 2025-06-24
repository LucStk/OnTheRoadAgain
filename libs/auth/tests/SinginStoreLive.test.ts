import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../src/auth_store'
import {api} from '../src/api'

describe('Auth Store Live', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should be able to login', async () => {
    const data = { 
      email: "alice@example.com", 
      username: "Alice",
      password: "alicepassword" }

      try{
        const res = await api.post("signup/", data)}
        catch(error: any){
          console.error('Erreur API:', error.response?.status, error.response?.data)
          expect(error.status).toBe(400)
        }
  })
})
