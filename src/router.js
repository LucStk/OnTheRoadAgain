import { createMemoryHistory, createRouter } from 'vue-router'

import Map from '@MapApp/Map.vue';
import User from '@UserApp/User.vue'
import Login from '@UserApp/Login.vue'


const routes = [
  { path: '/map/', component: Map, name :"map" },
  { path: '/users/:username',
    name: 'User',
    component: User,
  },
  { path: '/me/', component: User, name :"user" },
  { path: '/login/', component: Login, name :"login" },
  { path: '/', component: Login, name :"login_first" },
]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router