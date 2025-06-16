import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

export function setupPinia() {
  const pinia = createPinia()
  pinia.use(piniaPersistedstate)
  return pinia
}