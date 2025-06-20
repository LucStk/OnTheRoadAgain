import { createApp } from 'vue'
import {App_UI} from '@repo/ui'
import './main.css';
import "flyonui/flyonui";

import { useAuthStore, pinia_auth } from '@repo/auth'
import {router} from '@repo/ui'


const app = createApp(App_UI)
app.use(router)
app.use(pinia_auth);
app.mount('#app')
useAuthStore()

