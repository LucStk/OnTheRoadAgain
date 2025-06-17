import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import "flyonui/flyonui";

import { createRouter, createWebHistory } from 'vue-router'
import { routes,handleHotUpdate } from 'vue-router/auto-routes'

import { useAuthStore, pinia_auth } from '@ontheroadagain/auth'

const router = createRouter({
  history: createWebHistory(),
  // pass the generated routes written by the plugin 🤖
  routes,
})
if (import.meta.hot) {
  handleHotUpdate(router)
}

router.afterEach(async (to, from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods.autoInit(), 100);
});

const app = createApp(App)
app.use(router)
app.use(pinia_auth);
app.mount('#app')
const auth = useAuthStore()

