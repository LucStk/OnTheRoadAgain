import { createApp } from 'vue'
import App from './App_UI.vue'
import "./main.css"
import "flyonui/flyonui";
//import 'cropperjs/dist/cropper.css'
import router from './router'

import { useAuthStore, pinia_auth } from '@repo/auth'

const app = createApp(App)
app.use(router)
app.use(pinia_auth);
app.mount('#app')
useAuthStore()

