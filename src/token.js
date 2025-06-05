import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Instance Axios personnalisée
const api = axios.create({
  baseURL: API_URL,
});

// Fonction pour stocker le token dans axios et localStorage
function setAccessToken(token) {
  localStorage.setItem('access_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Fonction pour retirer les tokens et headers
function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete api.defaults.headers.common['Authorization'];
}

// Login : récupère tokens et configure axios
export async function login(username, password) {
  try {
    const response = await api.post('token/', { username, password });
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    setAccessToken(accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    return true;
  } catch (error) {
    console.error('Erreur login:', error);
    return false;
  }
}

// Refresh token : récupère un nouveau access token avec le refresh token
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post('token/refresh/', { refresh: refreshToken });
    const newAccessToken = response.data.access;
    setAccessToken(newAccessToken);
  } catch (error) {
    console.error('Erreur rafraîchissement token:', error);
    clearTokens();
    throw error;
  }
}

// Logout : informe API, supprime tokens et redirige
export async function logout() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    await api.post('logout/', { refresh: refreshToken });
  } catch (error) {
    console.error('Erreur logout:', error);
  } finally {
    clearTokens();
    window.location.href = '/login';
  }
}

// Intercepteur requêtes : ajoute token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur réponses : rafraîchit token si 401 (non retryé)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        const newAccessToken = localStorage.getItem('access_token');
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        await logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;