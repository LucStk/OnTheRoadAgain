import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia_auth = createPinia();
pinia_auth.use(piniaPluginPersistedstate);

export { pinia_auth }
export { api } from './api'
export { useAuthStore } from './auth_store'
export { logout } from './signout'