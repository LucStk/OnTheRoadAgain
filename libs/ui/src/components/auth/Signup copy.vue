
<template>

  <Teleport to="body">
    <div v-show="uistore.showSignup" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div class="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <ButtonClose :onclick="() => uistore.hideSignupModal()"/>

        <h2 class="text-2xl font-semibold mb-6 text-center text-black">Créer un utilisateur</h2>
        
        <Form :validation-schema="validationSchema" @submit="onSubmit">
          <InlineInput name= 'username'  label= 'Username' type = 'username' placeholder = 'User'/>
          <InlineInput name= 'email'  label= 'Email' type = 'email' placeholder = 'example@example.com'/>
          <InlineInput name= 'password'  label= 'password' type = 'password' placeholder = '***'/>
          <InlineInput name= 'confirmpassword'  label= 'Confirm password' type = 'password' placeholder = ''/>

          <div class="mt-5 flex flex-col md:flex-row md:items-center">
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
import { Form, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import ButtonClose from "../layout/ButtonClose.vue";
import InlineInput from "../layout/InlineInput.vue";

import { useUIStore,  } from '@repo/ui'
import { useAuthStore, api } from '@repo/auth'

const uistore = useUIStore()
const auth = useAuthStore()

const { setFieldError } = useForm()
setFieldError('email', 'Cet email est déjà pris')
setFieldError('username', 'Cet username est déjà pris')
const validationSchema = toTypedSchema(
  zod.object({
    username : zod.string().min(1, { message: 'This is required' }),
    email    : zod.string().min(1, { message: 'This is required' }).email({ message: 'Must be a valid email' }),
    password : zod.string().min(1, { message: 'This is required' }).min(8, { message: 'Too short' }),
    confirmpassword: zod
        .string()
        .min(1, { message: 'This is required' }),
  }).refine((data) => data.password === data.confirmpassword, {
    path: ['confirmpassword'],
    message: 'Les deux mots de passe ne correspondent pas',
  })
);

async function onSubmit(values: any) {
  
  try {
    const res = await api.post<{ access: string }>('signup/', values)
    if (res.status === 200) {
      auth.isUserLoaded = true
      auth.access.value = res.data.access
      //await auth.fetchUser()
    }
  } catch (err : any) {
    const errors = err.response?.data
    console.error('Erreur dans onSubmit:', errors)
    if (!errors) return
    for (const key in errors) {
      const messages = errors[key]
      if (Array.isArray(messages)) {
        console.log('Messages:', key, messages[0])
        setFieldError("email", "email pouris")//messages[0]) // affiche le premier message d’erreur
      }
    }
  }
}

</script>




