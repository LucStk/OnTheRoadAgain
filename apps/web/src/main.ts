import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import "flyonui/flyonui";
import {router} from '@repo/ui'

const app = createApp(App)
console.log(router)
app.use(router)

app.mount('#app')


