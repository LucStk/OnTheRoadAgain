import { createMemoryHistory, createRouter } from 'vue-router'

import App from '@MapApp/Map.vue';
import User from '@MapUser/User.vue'


const routes = [
  { path: '/', component: App, name :"Map" },
  { path: '/users/', component: User, name :"user" },
]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router