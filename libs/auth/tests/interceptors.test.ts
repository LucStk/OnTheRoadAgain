// tests/intercepteur.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../src/auth_store'

vi.mock('axios', () => import('../__mocks__/axios'))

import {
  mockPost,
  requestUseMock,
  responseUseMock,
} from '../__mocks__/axios'

describe('Axios interceptors', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const auth = useAuthStore()
    auth.access = 'initial-access-token'
    auth.isUserLoaded = false
    mockPost.mockReset()
  })

  it('should add Authorization header to requests', async () => {
    const auth = useAuthStore()
    auth.access = 'my-access-token'

    const config = { headers: {} }

    const { requestInterceptor } = await import('../src/intercepteur')
    const newConfig = requestInterceptor(config as any)

    expect(newConfig.headers['Authorization']).toBe('Bearer my-access-token')
  })

  it('should refresh token on 401 response', async () => {
    const auth = useAuthStore()

    mockPost.mockResolvedValueOnce({
      data: { access: 'new-access-token' },
    })

    const failedRequest = {
      response: {
        config: {
          headers: {} as Record<string, string>,
        },
      },
    }

    const { refreshInterceptor } = await import('../src/intercepteur')

    await refreshInterceptor(failedRequest as any)

    expect(auth.access).toBe('new-access-token')
    expect(auth.isUserLoaded).toBe(true)
    expect(failedRequest.response.config.headers['Authorization']).toBe('Bearer new-access-token')
  })

  it('should reset access if refresh fails', async () => {
    const auth = useAuthStore()

    mockPost.mockRejectedValueOnce(new Error('refresh failed'))

    const failedRequest = {
      response: {
        config: {
          headers: {},
        },
      },
    }

    const { refreshInterceptor } = await import('../src/intercepteur')

    await expect(refreshInterceptor(failedRequest as any)).rejects.toThrow('refresh failed')
    expect(auth.access).toBe('')
  })
})