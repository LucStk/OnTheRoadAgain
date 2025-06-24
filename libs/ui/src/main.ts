import { createApp } from 'vue'
import App from './App_UI.vue'
import "./main.css"
//import 'cropperjs/dist/cropper.css'
import buildRouter from './router'
import { routes } from 'vue-router/auto-routes'

import { useAuthStore, pinia_auth } from '@repo/auth'
const router = buildRouter(routes)
const app = createApp(App)
app.use(router)
app.use(pinia_auth);
app.mount('#app')
useAuthStore()

