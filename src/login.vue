<template>
  <div class="login-form">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
          autocomplete="username"
        />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          autocomplete="current-password"
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      this.error = null;
      this.loading = true;

      try {
        const response = await axios.post('http://localhost:8000/api/token/', {
          username: this.username,
          password: this.password,
        });

        // Stocker les tokens dans localStorage
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Configurer axios pour envoyer automatiquement le token JWT
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        // Ici tu peux rediriger vers une page protégée
        this.$router.push('/dashboard'); // par exemple si tu utilises Vue Router

      } catch (err) {
        this.error = 'Nom d’utilisateur ou mot de passe incorrect.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: auto;
}
label {
  display: block;
  margin-top: 1em;
}
input {
  width: 100%;
  padding: 0.5em;
  margin-top: 0.2em;
}
button {
  margin-top: 1.5em;
  padding: 0.7em;
  width: 100%;
}
.error {
  color: red;
  margin-top: 1em;
}
</style>
