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

<script setup>
  

  async function handleLogin(){
    this.loading = true;
    this.error = null;
    const response = await login(this.username, this.password);
    this.loading = false;
    // Ici tu peux rediriger vers une page protégée
    if (response){
      this.$router.push('/user'); // par exemple si tu utilises Vue Router
    }
    else{
      this.error = 'Nom d’utilisateur ou mot de passe incorrect.';
    };
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
