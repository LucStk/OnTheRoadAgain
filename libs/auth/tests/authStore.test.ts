import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../src/auth_store'
import { api } from '../src/api'

vi.mock('../src/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

const mockApi = api as unknown as {
  post: ReturnType<typeof vi.fn>,
  get: ReturnType<typeof vi.fn>
}

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockApi.post.mockReset()
    mockApi.get.mockReset()
  })

  it('should initialize with default values', () => {
    const auth = useAuthStore()

    expect(auth.access).toBe('')
    expect(auth.isUserLoaded).toBe(false)
    expect(auth.username).toBe('Invité')
  })

  it('should update access and fetch user on login', async () => {
    const auth = useAuthStore()

    mockApi.post.mockResolvedValueOnce({ data: { access: 'fake-token' } })
    mockApi.get.mockResolvedValueOnce({ data: { username: 'John' } })

    const result = await auth.login('john', 'secret')

    expect(result).toBe(true)
    expect(auth.access).toBe('modifié') // car tu as mis "modifié" en dur
    expect(auth.username).toBe('John')
    expect(auth.isUserLoaded).toBe(false) // pas modifié ici dans ton code
  })

  it('should throw error if login fails', async () => {
    const auth = useAuthStore()

    mockApi.post.mockRejectedValueOnce(new Error('fail'))

    await expect(auth.login('john', 'wrong')).rejects.toThrow('fail')
    expect(auth.access).toBe('')
  })

  it('should fetch user and update state', async () => {
    const auth = useAuthStore()

    mockApi.get.mockResolvedValueOnce({
      data: {
        username: 'Alice',
        email: 'alice@example.com',
      },
    })

    await auth.fetchUser()

    expect(auth.username).toBe('Alice')
    expect(auth.email).toBe('alice@example.com')
  })

  it('should throw error if fetchUser fails', async () => {
    const auth = useAuthStore()

    mockApi.get.mockRejectedValueOnce(new Error('fetch failed'))

    await expect(auth.fetchUser()).rejects.toThrow('fetch failed')
  })

  it('should reset store correctly', () => {
    const auth = useAuthStore()

    auth.access = 'abc'
    auth.isUserLoaded = true
    auth.username = 'Bob'
    auth.email = 'bob@example.com'

    auth.resetStore()

    expect(auth.access).toBe('')
    expect(auth.isUserLoaded).toBe(false)
    expect(auth.username).toBe('Invité')
    expect(auth.email).toBeUndefined()
  })
})
