import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from 'ui_remote/router' // ✅ import direct du remote exposé

import "flyonui/flyonui"
import './main.css'

async function bootstrap() {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  const app = createApp(App)
  app.use(pinia)
  app.use(router)
  app.mount('#app')
}

bootstrap()
