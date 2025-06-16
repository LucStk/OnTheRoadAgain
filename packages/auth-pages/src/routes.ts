import { routes as authRoutes } from 'vue-router/auto/routes'
import { globalMiddleware } from './middleware'

export const useAuthRouterConfig = () => ({
  routes: authRoutes,
  middleware: globalMiddleware
})