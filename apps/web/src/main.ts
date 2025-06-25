import { createApp } from 'vue'
import {App_UI} from '@repo/ui'
import './main.css';

import { useAuthStore, pinia_auth } from '@repo/auth'
import {buildRouter} from '@repo/ui'

import { routes as allRoutes } from 'vue-router/auto-routes'


//Fonction pour permettre de surcharger les routes importées 

function overrideRoutes(routes: any[]) {
  // Par exemple, filtre la route /home de libs/ui
  // puis injecte ta version locale
  const filtered = routes.filter(r => r.path !== '/')
  // Ajoute ta propre route pour /home (par exemple)
  filtered.push({
    path: '/',
    component: () => import('./pages/index.vue'),
  })
  return filtered
}

const routes = overrideRoutes(allRoutes)  
const router = buildRouter(routes)

const app = createApp(App_UI)
app.use(router)
app.use(pinia_auth);
app.mount('#app')
useAuthStore()

