<template>
  <Teleport to="body">
    <div v-show="uistore.showSignup" class="fixed flex justify-center items-center h-screen w-screen bg-black/40">
      <div class="relative max-w-md mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6 text-black">
        <button @click="uistore.hideSignupModal()" class=" cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold" aria-label="Close modal">✖</button>
        <h2 class="text-2xl font-semibold text-center text-black">Créer un utilisateur</h2>

        <Form @submit="handleSubmit" :validation-schema="signupSchema">
          <!-- Username -->
          <div class="input-floating w-full">
            <Field name="username" type="text" placeholder="Jiji" class="input text-base-100 w-full" />
            <label class="input-floating-label">Username</label>
            <ErrorMessage name="username" class="helper-text text-red-500 text-sm" />
          </div>

          <!-- Email -->
          <div class="input-floating w-full">
            <Field name="email" type="email" placeholder="jean@example.com" class="input w-full" />
            <label class="input-floating-label">Email</label>
            <ErrorMessage name="email" class="helper-text text-red-500 text-sm" />
          </div>

          <!-- Password -->
          <div class="input-floating w-full relative">
            <Field name="password" v-slot="{ field, meta }">
              <input v-bind="field" type="password" placeholder="••••••••" class="input w-full" />
              <label class="input-floating-label">Mot de passe</label>
              <ErrorMessage name="password" class="helper-text text-red-500 text-sm" />
              <PasswordStrength :password="field.value" />
            </Field>
          </div>

          <!-- Password Confirm -->
          <div class="input-floating w-full">
            <Field name="passwordConfirm" type="password" placeholder="••••••••" class="input w-full" />
            <label class="input-floating-label">Confirmer le mot de passe</label>
            <ErrorMessage name="passwordConfirm" class="helper-text text-red-500 text-sm" />
          </div>

          <!-- Captcha -->
          <div class="input-floating w-full">
            <Field name="captcha" type="text" placeholder="Captcha" class="input w-full" />
            <label class="input-floating-label">Captcha</label>
            <ErrorMessage name="captcha" class="helper-text text-red-500 text-sm" />
          </div>

          <button type="submit" class="btn btn-primary w-full mt-4">Créer l'utilisateur</button>
        </Form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore, api } from '@repo/auth'
import { useUIStore } from '@repo/ui'

import { Form, Field, ErrorMessage } from 'vee-validate'
import { z } from 'zod'
import zxcvbn from 'zxcvbn'
import { computed, h } from 'vue'

const uistore = useUIStore()
const router = useRouter()
const auth = useAuthStore()

const signupSchema = z
  .object({
    username: z.string().min(1, { message: 'Username est requis' }),
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(6, { message: 'Mot de passe trop court' }),
    passwordConfirm: z.string().min(1, { message: 'Confirmation requise' }),
    captcha: z.string().min(1, { message: 'Captcha requis' }),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm'],
  })
  .refine(data => data.captcha.trim() === '7', {
    message: 'Captcha incorrect',
    path: ['captcha'],
  })

async function handleSubmit(values: any) {
  const res = await api.post<{ access: string }>('signup/', {
    username: values.username,
    email: values.email,
    password: values.password,
  })

  auth.isUserLoaded.value = true
  auth.access.value = res.data.access
  await auth.fetchUser()
  router.push('/profile')
}

// PasswordStrength component with bar and text
const PasswordStrength = {
  props: {
    password: String,
  },
  setup(props: { password: string }) {
    const score = computed(() => {
      if (!props.password) return 0
      return zxcvbn(props.password).score // 0-4
    })

    const messages = [
      'Très faible',
      'Faible',
      'Moyen',
      'Fort',
      'Très fort',
    ]

    const colors = ['#EF4444', '#F59E0B', '#EAB308', '#10B981', '#047857']

    return () =>
      h('div', { class: 'mt-1' }, [
        // Bar container
        h(
          'div',
          {
            class: 'w-full h-2 rounded bg-gray-300 overflow-hidden',
            'aria-hidden': 'true',
          },
          [
            // Bar fill
            h('div', {
              class: 'h-2 rounded transition-all duration-300',
              style: {
                width: `${((score.value + 1) / 5) * 100}%`,
                backgroundColor: colors[score.value],
              },
            }),
          ]
        ),
        // Text under bar
        h(
          'div',
          {
            class: 'text-sm font-semibold mt-1',
            style: { color: colors[score.value] },
          },
          `Force du mot de passe : ${messages[score.value]}`
        ),
      ])
  },
}
</script>

<style scoped>
.input-floating {
  position: relative;
  margin-bottom: 1.25rem;
}

.input-floating input {
  border: 1px solid #ccc;
  padding: 0.75rem 0.75rem 0.25rem 0.75rem;
  font-size: 1rem;
  width: 100%;
  border-radius: 0.375rem;
}

.input-floating-label {
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  font-size: 0.875rem;
  color: #999;
  pointer-events: none;
  transition: 0.2s ease all;
}

.input-floating input:focus + .input-floating-label,
.input-floating input:not(:placeholder-shown) + .input-floating-label {
  top: -0.5rem;
  font-size: 0.75rem;
  color: #333;
  background: white;
  padding: 0 0.25rem;
}
</style>
