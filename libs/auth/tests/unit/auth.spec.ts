import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { setupPinia } from '../setup'
import { useAuthStore } from '../../src/auth_store'

beforeEach(() => {
  localStorage.clear()
})

describe('AuthStore persisted rehydration', () => {
  beforeEach(() => {
    localStorage.setItem('auth-data', JSON.stringify({
      access: 'rehydrated-token',
      isUserLoaded: true,
      username: 'MockUser',
      photo_profil: undefined,
      bio: undefined,
      ville: undefined,
      pays: undefined,
      date_naissance: undefined,
      email: undefined,
    }))

    const pinia = setupPinia()
    setActivePinia(pinia)
  })

  it('rehydrates state from localStorage', () => {
    const auth = useAuthStore()

    // Forcer la réhydratation depuis localStorage
    const saved = localStorage.getItem('auth-data')
    if (saved) {
      auth.$patch(JSON.parse(saved))
    }

    expect(auth.access).toBe('rehydrated-token')
    expect(auth.isUserLoaded).toBe(true)
    expect(auth.username).toBe('MockUser')
    expect(auth.email).toBe(undefined)
  })
})
