
<template>
  <Teleport to="body">
    <div v-show="uistore.showSignup" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div class="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <ButtonClose :onclick="() => uistore.hideSignupModal()"/>

        <h2 class="text-2xl font-semibold mb-6 text-center text-black">Créer un utilisateur</h2>

        <Form @submit="onSubmit" :validation-schema="signupSchema" class="w-full">
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

import { useUIStore } from '@repo/ui'
import { Form, useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import ButtonClose from "../layout/ButtonClose.vue";
import InlineInput from "../layout/InlineInput.vue";
import InlineInputPassword from "../layout/InlineInputPassword.vue";

const uistore = useUIStore()


const signupSchema = z
  .object({
    username: z.string().min(1, 'Username est requis'),
    email: z.string().email('Email invalide'),
    password : z.string().min(6, 'Mot de passe requis'),
  })

const onSubmit = (values: any) => {
  console.log('Formulaire valide', values)
}


  import { useRouter } from 'vue-router'
import { useAuthStore, api } from '@repo/auth'
const router = useRouter()
  const auth = useAuthStore()
  handleSubmit(async (values) => {
  console.log('Formulaire valide', values)
  const res = await api.post<{ access: string }>('signup/', {
    username: values.username,
    email: values.email,
    password: values.password,
  })

  auth.isUserLoaded.value = true
  auth.access.value = res.data.access
  await auth.fetchUser()
  router.push('/profile')
}*/
</script>




