import { createMemoryHistory, createRouter,createWebHistory } from 'vue-router'

import Map from '@MapApp/Map.vue'
import User from '@UserApp/User.vue'
import Login from '@UserApp/Login.vue'

const routes = [
  // Redirection de la racine vers la carte
  { path: '/', redirect: '/map' },

  // Carte
  { path: '/map/', name: 'map', component: Map },

  // Page de profil utilisateur connecté
  { path: '/me/', name: 'me', component: User },

  // Page de profil d’un autre utilisateur
  { path: '/users/:username', name: 'user', component: User },

  // Page de login
  { path: '/login/', name: 'login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router