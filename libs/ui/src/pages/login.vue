<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="mt-1 text-black block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autocomplete="username"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            id="password"
            autocomplete="current-password"
            class="mt-1 text-black block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

      <button type="submit" :disabled="loading" 
          class="btn btn-success btn-block">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>

      <a class="btn btn-ghost btn-block" href="signup">
          Sign up
      </a>
      <p v-if="error" class="error">{{ error }}</p>



      </form>
    </div>
  </div>
  </template>

<script setup lang="ts">
  definePage({
    meta: {requiresGuest: true,},
  })
  import { ref } from 'vue'
  import { useAuthStore } from '@repo/auth'
  import router from '../router';

  const auth   = useAuthStore();

  const username = ref('')
  const password = ref('')
  const error    = ref("")
  const loading  = ref(false)

  async function handleLogin() {
    loading.value = true
    error.value = ""

    try {
      const success = await auth.login(username.value, password.value)
      if (success) {
        router.push('/profile')
      } else {
        error.value = 'Nom d’utilisateur ou mot de passe incorrect.'
      }
    }catch(e){
      error.value = (e as Error).message;
    }finally{
      loading.value = false
    }
    

  }
</script>
