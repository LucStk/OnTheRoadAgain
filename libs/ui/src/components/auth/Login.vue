<template>
  <Teleport to="body">
  <div v-show="uistore.showLogin" class=" 
    absolute flex justify-center items-center h-screen w-screen bg-black/40">

    <div class="relative w-full max-w-sm p-8 bg-white rounded-md shadow-xl">
      
      <!-- Croix de fermeture -->
      <ButtonClose :onclick="() => uistore.hideLoginModal()"/>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="input-custom-label">Email</label>
          <input
            v-model="email"
            type="text"
            id="email"
            class="input-custom"
            autocomplete="username"
            required
          />
        </div>

        <div class="mb-4">
          <label class="input-custom-label">Password</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            autocomplete="current-password"
            class="input-custom"
            required
          />
          <div class="mt-2 text-sm">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="showPassword" class="form-checkbox" />
              <span class="ml-2 text-gray-600">Afficher le mot de passe</span>
            </label>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="btn btn-success btn-block w-full">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <!-- Lien Sign up simple -->
        <div class="mt-4 cursor-pointer text-sm text-center text-black underline">
          <button class="underline cursor-pointer"
            @click="uistore.showSignupModal(); uistore.hideLoginModal()"
          >
            Sign up
          </button>
          </div>
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
      </form>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@repo/auth'
import { useUIStore } from '@repo/ui'
import ButtonClose from "../layout/ButtonClose.vue";


const auth = useAuthStore()
const uistore = useUIStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const success = await auth.login(email.value, password.value)
    if (success) {
      uistore.hideLoginModal()
    } else {
      error.value = 'Nom d’utilisateur ou mot de passe incorrect.'
    }
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>
