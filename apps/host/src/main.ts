import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { createApp } from 'vue';
import App from './App.vue';

import router from './services/router';
import {api} from "./services/api";
import './services/intercepteur'

import "flyonui/flyonui";
import './main.css';
import './assets/css/elements.css';

import VueMaplibreGl from '@indoorequal/vue-maplibre-gl';

async function bootstrap() {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  const app = createApp(App);
  app.use(pinia);

  //app.use(VueMaplibreGl);
  //app.use(router);

  app.mount('#app');
}

bootstrap();