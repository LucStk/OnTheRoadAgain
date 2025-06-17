import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import "flyonui/flyonui";

import router from './router'

import { useAuthStore, pinia_auth } from '@ontheroadagain/auth'

const app = createApp(App)
app.use(router)
app.use(pinia_auth);
app.mount('#app')
const auth = useAuthStore()

