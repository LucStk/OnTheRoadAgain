// __mocks__/axios.ts
import { vi } from 'vitest'

export const mockPost = vi.fn()
export const mockGet = vi.fn()
export const requestUseMock = vi.fn()
export const responseUseMock = vi.fn()

const axiosMock = {
  create: vi.fn(() => ({
    post: mockPost,
    get: mockGet,
    interceptors: {
      request: { use: requestUseMock },
      response: { use: responseUseMock },
    },
  })),
  post: mockPost,
  get: mockGet,
  interceptors: {
    request: { use: requestUseMock },
    response: { use: responseUseMock },
  },
}

export default axiosMock