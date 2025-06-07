
// FlyonUI
import "flyonui/flyonui";
import './main.css';
import './assets/css/elements.css';
import VueMaplibreGl from '@indoorequal/vue-maplibre-gl'

import { createPinia } from 'pinia';
import { createApp } from 'vue'
import router from './router'

import App from './App.vue'

createApp(App).use(router).mount('#app')

const pinia = createPinia()
const app = createApp(App)

app.use(VueMaplibreGl)
app.use(pinia)
app.use(router)
app.mount('#app')
