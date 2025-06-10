import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Intercepteur de requête : ajoute le token dynamiquement
api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const access = localStorage.getItem('access');
  if (access) {
    // Vérifie si headers est bien de type AxiosHeaders
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${access}`);
    } else if (config.headers) {
      // Si headers est de type RawAxiosHeaders (objet simple)
      config.headers['Authorization'] = `Bearer ${access}`;
    }
  }
  return config;
});

// Intercepteur de réponse : refresh token si 401
createAuthRefreshInterceptor(api, async (failedRequest: any): Promise<void> => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error('No refresh token');

  try {
    const response: AxiosResponse<{ access: string }> = await axios.post(
      'http://localhost:8000/api/token/refresh/',
      { refresh }
    );

    const newAccess = response.data.access;
    localStorage.setItem('access', newAccess);

    if (failedRequest.response.config.headers && typeof failedRequest.response.config.headers.set === 'function') {
      failedRequest.response.config.headers.set('Authorization', `Bearer ${newAccess}`);
    } else {
      failedRequest.response.config.headers['Authorization'] = `Bearer ${newAccess}`;
    }

    return Promise.resolve();
  } catch (error) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
    return Promise.reject(error);
  }
});