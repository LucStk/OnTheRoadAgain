
// FlyonUI
import "flyonui/flyonui";
import './main.css';
import './assets/css/elements.css';
import VueMaplibreGl from '@indoorequal/vue-maplibre-gl'

import { createPinia } from 'pinia';
import { createApp } from 'vue'
import router from './router/router'

import App from './App.vue'

async function bootstrap() {
    const pinia = createPinia()
    const app = createApp(App)

    app.use(VueMaplibreGl)
    app.use(pinia)
    app.use(router)

    // ⚠️ Initialisation de l'auth avant le rendu
    
    const auth = useAuthStore();
    await auth.initialize();
    
    app.mount('#app');
    

}

bootstrap(); // ✅ App lancée quand tout est prêt
