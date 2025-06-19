import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import "flyonui/flyonui";

import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore, pinia_auth } from '@ontheroadagain/auth'
import {routes} from '@ontheroadagain/ui'

console.log(routes)
const router = createRouter({
  history: createWebHistory(),
  routes,
})


const app = createApp(App)
app.use(router)
app.use(pinia_auth);
app.mount('#app')
const auth = useAuthStore()

