<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
    <h2 class="text-2xl font-semibold text-center">Créer un utilisateur</h2>

    <!-- Champ Nom -->
    <div class="input-floating w-full">
      <input
        v-model="form.name"
        type="text"
        placeholder="Jean Dupont"
        class="input w-full"
        :class="{ 'border-red-500': errors.name }"
      />
      <label class="input-floating-label">Nom</label>
      <p v-if="errors.name" class="helper-text text-red-500 text-sm">{{ errors.name }}</p>
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

    <!-- Bouton -->
    <button class="btn btn-primary w-full" @click="handleSubmit">Créer l'utilisateur</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
})

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function handleSubmit() {
  errors.name = ''
  errors.email = ''
  errors.password = ''

  let valid = true

  if (!form.name) {
    errors.name = 'Le nom est requis'
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

  if (!valid) return

  console.log('Utilisateur créé:', { ...form })

  form.name = ''
  form.email = ''
  form.password = ''
}
</script>