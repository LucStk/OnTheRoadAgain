import type {} from "vite";
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { globalMiddleware } from './middleware'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

router.beforeEach(globalMiddleware)
router.afterEach(async (_to, _from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods.autoInit(), 100);
});

export default router