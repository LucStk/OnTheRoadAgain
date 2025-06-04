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

async function logout() {
  try{
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    axios.post(API_URL + "logout/",{ refresh: refreshToken,},{
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Auth dans les headers
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (response.status === 205) {
        console.log("Déconnexion réussie !");
        // Supprimer les tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Redirection ou état
        window.location.href = "/login";
      }
    })

  } catch(error) {
    if (error.response) {
      console.error("Erreur de l'API :", error.response.data);
    } else {
      console.error("Erreur réseau :", error.message);
    }
  }
}


//Refresh token automatiquement
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si token expiré et qu'on n'a pas encore tenté de le rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        const newAccessToken = localStorage.getItem('access_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest); // Rejouer la requête
      } catch (refreshError) {
        console.error("Refresh échoué, déconnexion forcée");
        logout();
      }
    }

    return Promise.reject(error);
  }
);