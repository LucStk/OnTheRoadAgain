<template>
  <Teleport to="body">
    <div v-show="uistore.showSignup" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div class="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <ButtonClose :onclick="() => uistore.hideSignupModal()"/>

        <h2 class="text-2xl font-semibold mb-6 text-center text-black">Créer un utilisateur</h2>

        <Form @submit="" class="space-y-5">
          <InlineInput name= 'username'  label= 'Username' type = 'text' placeholder = 'Jiji'/>
          <InlineInput name= 'email'  label= 'Email' type = 'email' placeholder = 'example@example.com'/>
          <InlineInputPassword />

          <!-- Bouton -->
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="md:w-1/3"></div>
            <div class="md:w-2/3">
              <button
                type="submit"
                class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                Créer l'utilisateur
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore, api } from '@repo/auth'
import { useUIStore } from '@repo/ui'

import { Form, Field, ErrorMessage, useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'


import ButtonClose from "../layout/ButtonClose.vue";
import InlineInput from "../layout/InlineInput.vue";
import InlineInputPassword from "../layout/InlineInputPassword.vue";

const uistore = useUIStore()
const router = useRouter()
const auth = useAuthStore()

const signupSchema = z
  .object({
    username: z.string().min(1, 'Username est requis'),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Mot de passe trop court'),
    passwordConfirm: z.string().min(1, 'Confirmation requise'),
    captcha: z.string().min(1, 'Captcha requis'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm'],
  })
  .refine(data => data.captcha.trim() === '7', {
    message: 'Captcha incorrect',
    path: ['captcha'],
  })

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(signupSchema),
})

const submit = handleSubmit(async (values) => {
  const res = await api.post<{ access: string }>('signup/', {
    username: values.username,
    email: values.email,
    password: values.password,
  })

  auth.isUserLoaded.value = true
  auth.access.value = res.data.access
  await auth.fetchUser()
  router.push('/profile')
})

// Champ à boucler dans le template
const fields = [
  { name: 'username', label: 'Username', type: 'text', placeholder: 'Jiji' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'jean@example.com' },
  { name: 'passwordConfirm', label: 'Confirmer', type: 'password', placeholder: '••••••••' },
  { name: 'captcha', label: 'Captcha', type: 'text', placeholder: '7' },
]


</script>
