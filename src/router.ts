import type {} from "vite";
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'


const router = createRouter({
  history: createWebHistory(),
  routes,
})

if (import.meta.hot) { 
  handleHotUpdate(router) 
} 

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const needsAuth = to.meta.requiresAuth;

  if (needsAuth) {
    if (!auth.access || !auth.user) {
      if (auth.access && !auth.user) {
        try {
          await auth.fetchUser();
          return next();
        } catch (e) {
          return next('/login');
        }
      }

      return next('/login');
    }
  }

  next();
});


export default router