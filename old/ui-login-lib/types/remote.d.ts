declare module 'ui_remote/router' {
  import type { Router } from 'vue-router'
  const router: Router
  export default router
}

declare module 'ui_remote/useAuthStore' {
  import type { Store } from 'pinia'
  export const useAuthStore: () => Store
}

declare module 'ui_remote/api' {
  export const api: any // adapte selon tes types
}