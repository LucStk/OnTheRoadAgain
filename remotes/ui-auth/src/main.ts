import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';

import "flyonui/flyonui";
import './main.css';

import router from 'ui_remote/index';
//import {api} from "./services/api";
//import './services/intercepteur'



async function bootstrap() {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  const app = createApp(App);
  app.use(pinia);
  app.use(router);

  app.mount('#app');
}

bootstrap();