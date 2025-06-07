import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Instance Axios personnalisée
const api = axios.create({
  baseURL: API_URL,
});

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

    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);

    return true;
  } catch (error) {
    console.error('Erreur login:', error);
    return false;
  }
}

// Refresh token : récupère un nouveau access token avec le refresh token
export async function refreshAccessToken() {
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

export default api;