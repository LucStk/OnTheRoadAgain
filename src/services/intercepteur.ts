import {InternalAxiosRequestConfig,} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { useAuthStore } from '@/stores/auth'



// Intercepteur de requête : ajoute le token dynamiquement
api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const auth = useAuthStore()
  const access = auth.access

  // Vérifie si headers est bien de type AxiosHeaders
  if (config.headers && typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${access}`);
  } else if (config.headers) {
    // Si headers est de type RawAxiosHeaders (objet simple)
    config.headers['Authorization'] = `Bearer ${access}`;
  }

  return config;
});

// Intercepteur de réponse : refresh token si 401
const plainAxios = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
});
createAuthRefreshInterceptor(api, async (failedRequest)=> {
  const auth = useAuthStore() 
  try {
    const response = await plainAxios.post<{ access: string }>('token/refresh/');
    const newAccess = response.data.access
    auth.access = newAccess
    auth.isUserLoaded = true
    console.warn("Access Token refreshed")
    // Met à jour la requête qui a échoué
    failedRequest.response.config.headers['Authorization'] = `Bearer ${newAccess}`
    
    return Promise.resolve();
  } catch (error) {
    auth.access = ""
    console.warn("Access Token cannot be refreshed")
    return Promise.reject(error)
  }
});


