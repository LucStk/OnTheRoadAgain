// router/middleware.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@ontheroadagain/auth';


export async function globalMiddleware(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const auth = useAuthStore();
  const needsAuth = to.meta.requiresAuth;
  const guestOnly = to.meta.requiresGuest;

  //TODO : Remplacer avec une vérification du access et du refresh par l'api
  if (needsAuth) {
    if (!auth.access || !auth.isUserLoaded) {
      if (auth.access && !auth.isUserLoaded) {
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
    if (auth.access && auth.isUserLoaded) {
      return next('/profile');
    }

    if (auth.access && !auth.isUserLoaded) {
      try {
        console.log("coucou")
        await auth.fetchUser();
        return next('/profile');
      } catch (e) {
        console.error("Error middleware", e)
        return next(); // token invalide → on reste sur la page guest
      }
    }
  }

  next();
}
