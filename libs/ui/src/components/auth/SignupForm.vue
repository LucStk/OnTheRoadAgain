<template>
  <Form
    :validation-schema="schema"
    v-slot="{ setErrors }"
    @submit="onSubmit"
    class="text-black space-y-4 max-w-md mx-auto p-6"
  >
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
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as zod from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import InlineInput from '../layout/InlineInput.vue'
import { useAuthStore, api } from '@repo/auth'

const auth = useAuthStore()
// Schéma de validation
const schema = toTypedSchema(
  zod.object({
    username : zod.string().min(1, { message: 'Ce champ est obligatoire' }),
    email    : zod.string().min(1, { message: 'Ce champ est obligatoir' }).email({ message: 'Doit être un email valide' }),
    password : zod.string().min(1, { message: 'Ce champ est obligatoir' }).min(8, { message: 'Trop court' }),
    confirmpassword: zod
        .string()
        .min(1, { message: 'Ce champ est obligatoir' }),
  }).refine((data) => data.password === data.confirmpassword, {
    path: ['confirmpassword'],
    message: 'Les deux mots de passe ne correspondent pas',
  })
);
// Fonction utilitaire pour transformer les erreurs Django
const transformDjangoErrors = (djangoErrors: { [s: string]: unknown } | ArrayLike<unknown>) => {
  const transformedErrors: { [key: string]: unknown } = {};
  
  for (const [field, errors] of Object.entries(djangoErrors)) {
    // Prend le premier message d'erreur ou joint tous les messages
    if (Array.isArray(errors)) {
      transformedErrors[field] = errors[0]; // Premier message
      // Ou pour joindre tous les messages : transformedErrors[field] = errors.join(', ');
    } else {
      transformedErrors[field] = errors;
    }
  }
  
  return transformedErrors;
};
// Fonction de soumission
const onSubmit = async (values: any, actions: any) => {
  try {
    const res = await api.post<{ access: string }>('signup/', values)
    if (res.status === 200) {
      auth.isUserLoaded.value = true
      auth.access.value = res.data.access
    }
    
    // En cas de succès, vous pourriez faire :
    // console.log('Formulaire soumis avec succès!')
    // router.push('/dashboard')
    
  } catch (error : any) {
    if (!error.response) return
    actions.setErrors(transformDjangoErrors(error.response?.data))
  }
}
</script>