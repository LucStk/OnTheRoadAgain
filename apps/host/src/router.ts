import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes: hostRoutes } from 'vue-router/auto/routes'
import { authRoutes, globalMiddleware as authMiddleware } from 'auth-pages'

// Fusionner les routes
const { routes: authRoutes, middleware } = useAuthRouterConfig()

const router = createRouter({
  history: createWebHistory(),
  routes: [...hostRoutes, ...authRoutes]
})

router.beforeEach(middleware)

export default router