import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../src/auth_store'
import {api} from '../src/api'

describe('Auth Store Live', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should be able to login', async () => {
    const data = { email: "alice@example.com", password: "alicepassword" }
    try {
      const res = await api.post("token/", data)
      console.log('Success:', res)
      expect(res.status).toBe(200)
      expect(res.data.access).toBeDefined()
    } catch (error: any) {
      // Axios met la réponse dans error.response
      console.error('Erreur API:', error.response?.status, 
                error.response?.data)
      throw error  // pour que Vitest sache que le test échoue
    }
  })

  it('auth_store login should return a token', async () => {
    const data = { email: "alice@example.com", password: "alicepassword" }
    try {
      const auth = useAuthStore()
      const res = await auth.login(data.email, data.password)
      console.log('Success:', res)
      expect(res).toBe(true)
      expect(auth.isUserLoaded).toBe(true)
      expect(auth.access.value).toBeDefined()
      expect(auth.username).toBe('alice')

    } catch (error: any) {
      // Axios met la réponse dans error.response
      console.error('Erreur API:', error.response?.status, 
                error.response?.data)
      throw error  // pour que Vitest sache que le test échoue
    }
  })
})
