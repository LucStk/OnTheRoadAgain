import { createApp } from 'vue'
import App from './App_UI.vue'
import './main.css';
import "flyonui/flyonui";
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

