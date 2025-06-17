import axios, {InternalAxiosRequestConfig,} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { useAuthStore } from './auth_store'
import {api} from "./api"


// Intercepteur de requête : ajoute le token dynamiquement
export function requestInterceptor(config: InternalAxiosRequestConfig) {
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
};

// Intercepteur de réponse : refresh token si 401
const plainAxios = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
});
export async function refreshInterceptor(failedRequest: any) {
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
}
api.interceptors.request.use(requestInterceptor)
createAuthRefreshInterceptor(api, refreshInterceptor)

