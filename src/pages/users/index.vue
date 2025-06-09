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

      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>



      </form>
    </div>
  </div>
</template>

<script setup>
  import { login } from '@/token.js'

  const username = ref('')
  const password = ref('')
  const error = ref(null)
  const loading = ref(false)
  const router = useRouter()

  async function handleLogin() {
    loading.value = true
    error.value = null

    const success = await login(username.value, password.value)

    loading.value = false

    if (success) {
      router.push('/users/me')
    } else {
      error.value = 'Nom d’utilisateur ou mot de passe incorrect.'
    }
  }
</script>
