// router/middleware.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export async function globalMiddleware(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const auth = useAuthStore();
  const needsAuth = to.meta.requiresAuth;
  const guestOnly = to.meta.requiresGuest;

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

  if (guestOnly) {
    if (auth.access && auth.user) {
      return next('/users');
    }

    if (auth.access && !auth.user) {
      try {
        await auth.fetchUser();
        return next('/users');
      } catch (e) {
        return next(); // token invalide → on reste sur la page guest
      }
    }
  }

  next();
}
