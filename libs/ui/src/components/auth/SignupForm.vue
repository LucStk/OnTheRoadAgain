<template>
  <Form
    :validation-schema="schema"
    v-slot="{ setErrors }"
    @submit="onSubmit"
    class="text-black space-y-4 max-w-md mx-auto p-6"
  >
    <InlineInput name= 'username'  label= 'Username' type = 'text' placeholder = 'Jiji'/>
    <InlineInput name= 'email'  label= 'Email' type = 'email' placeholder = 'example@example.com'/>
    <InlineInput name= 'password'  label= 'Password' type = 'password' placeholder = 'Jiji'/>

    <button 
      type="submit" 
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
    >
      Envoyer
    </button>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as zod from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import InlineInput from '../layout/InlineInput.vue'

// Schéma de validation
const schema = toTypedSchema(
  zod.object({
    email: zod.string().email('Email invalide').min(1, 'Email requis'),
    password: zod.string().min(4, 'Mot de passe trop court (minimum 4 caractères)'),
  })
)

// Fonction de soumission
const onSubmit = async (values: any, actions: any) => {
  try {
    console.log('Valeurs soumises:', values)
    
    // Simule un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simule une erreur serveur (vous pouvez commenter ces lignes)
    actions.setErrors({
      email: 'Cet email est déjà utilisé',
      password: 'Mot de passe trop faible selon nos critères'
    })
    
    // En cas de succès, vous pourriez faire :
    // console.log('Formulaire soumis avec succès!')
    // router.push('/dashboard')
    
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    actions.setErrors({
      email: 'Une erreur est survenue, veuillez réessayer'
    })
  }
}
</script>