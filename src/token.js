import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Fonction pour se connecter et récupérer JWT
async function login(username, password) {
  try {
    const response = await axios.post(API_URL + 'token/', {
      username,
      password,
    });
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    // Stocker tokens (localStorage ou sessionStorage)
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    // Configurer axios pour envoyer le token à chaque requête
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return true;
  } catch (error) {
    console.error('Erreur login:', error);
    return false;
  }
}

// Exemple appel API protégée
async function fetchProtectedData() {
  try {
    const response = await axios.get(API_URL + 'protected/');
    console.log(response.data);
  } catch (error) {
    console.error('Erreur accès API protégée:', error);
  }
}

// Fonction pour rafraîchir le token
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await axios.post(API_URL + 'token/refresh/', {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;
    localStorage.setItem('access_token', newAccessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  } catch (error) {
    console.error('Erreur rafraîchissement token:', error);
  }
}
