<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
    <h2 class="text-2xl font-semibold text-center">Créer un utilisateur</h2>

    <!-- Champ Username -->
    <div class="input-floating w-full">
      <input
        v-model="form.username"
        type="text"
        placeholder="Jiji"
        class="input w-full"
        :class="{ 'border-red-500': errors.username }"
      />
      <label class="input-floating-label">Username</label>
      <p v-if="errors.username" class="helper-text text-red-500 text-sm">{{ errors.username }}</p>
    </div>

    <!-- Champ Email -->
    <div class="input-floating w-full">
      <input
        v-model="form.email"
        type="email"
        placeholder="jean@example.com"
        class="input w-full"
        :class="{ 'border-red-500': errors.email }"
      />
      <label class="input-floating-label">Email</label>
      <p v-if="errors.email" class="helper-text text-red-500 text-sm">{{ errors.email }}</p>
    </div>

    <!-- Champ Mot de passe -->
    <div class="input-floating w-full">
      <input
        v-model="form.password"
        type="password"
        placeholder="••••••••"
        class="input w-full"
        :class="{ 'border-red-500': errors.password }"
      />
      <label class="input-floating-label">Mot de passe</label>
      <p v-if="errors.password" class="helper-text text-red-500 text-sm">{{ errors.password }}</p>
    </div>

    <!-- Champ Confirmation Mot de passe -->
    <div class="input-floating w-full">
      <input
        v-model="form.passwordConfirm"
        type="password"
        placeholder="••••••••"
        class="input w-full"
        :class="{ 'border-red-500': errors.passwordConfirm }"
      />
      <label class="input-floating-label">Confirmer le mot de passe</label>
      <p v-if="errors.passwordConfirm" class="helper-text text-red-500 text-sm">{{ errors.passwordConfirm }}</p>
    </div>

    <!-- CAPTCHA (simple question anti-bot) -->
    <div class="input-floating w-full">
      <Altcha/>
      <label class="input-floating-label">Captcha</label>
      <p v-if="errors.captcha" class="helper-text text-red-500 text-sm">{{ errors.captcha }}</p>
    </div>

    <!-- Bouton -->
    <button class="btn btn-primary w-full" @click="handleSubmit">Créer l'utilisateur</button>
  </div>
</template>

<script setup lang="ts">
definePage({
  meta: { requiresGuest: true },
})

import { reactive } from 'vue'
import { useAuthStore, api } from '@repo/auth'
import router from "../router"
import Altcha from "../components/Altcha.vue"

const form = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  captcha: '',
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  captcha: '',
})

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function handleSubmit() {
  // Reset erreurs
  Object.keys(errors).forEach((key) => {
    // @ts-ignore
    errors[key] = ''
  })

  const auth = useAuthStore()
  let valid = true

  if (!form.username) {
    errors.username = 'Username est requis'
    valid = false
  }

  if (!form.email || !validateEmail(form.email)) {
    errors.email = 'Email invalide'
    valid = false
  }

  if (!form.password || form.password.length < 6) {
    errors.password = 'Mot de passe trop court'
    valid = false
  }

  if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = 'Les mots de passe ne correspondent pas'
    valid = false
  }

  if (form.captcha.trim() !== '7') {
    errors.captcha = 'Captcha incorrect'
    valid = false
  }

  if (!valid) return

  const res = await api.post<{ access: string }>('signup/', {
    username: form.username,
    email: form.email,
    password: form.password,
  })

  auth.isUserLoaded = true
  auth.access = res.data.access
  await auth.fetchUser()
  console.log('Utilisateur créé:', { ...form })

  router.push('/profile')
}
</script>