<template>
  <div class="flex flex-col md:flex-row md:items-center gap-2">
    <label for="password" class="input-custom-label-inline">Password</label>
    <div class="md:w-2/3 w-full">
      <Field
        name="password"
        :type="showPassword ? 'text' : 'password'"
        id="password"
        placeholder="••••••••"
        class="input-custom-inline"
        v-slot="{ field }"
      >
        <input v-bind="field" type="password" class="input-custom-inline" />
      </Field>
      <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
      <PasswordStrength :password="password" />
    </div>
  </div>

  <div class="flex flex-col md:flex-row md:items-center gap-2">
    <label for="confirmpassword" class="input-custom-label-inline">Confirm Password</label>
    <div class="md:w-2/3 w-full">
      <Field
        name="confirmpassword"
        :type="showPassword ? 'text' : 'password'"
        id="confirmpassword"
        placeholder="••••••••"
        class="input-custom-inline"
        v-slot="{ field }"
      >
        <input v-bind="field" type="password" class="input-custom-inline" />
      </Field>
      <ErrorMessage name="confirmpassword" class="text-red-500 text-sm mt-1" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { Field, ErrorMessage, useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import zxcvbn from 'zxcvbn'

// 🧪 Zod schema avec égalité entre les 2 champs
const schema = z
  .object({
    password: z.string().min(1, 'Mot de passe requis'),
    confirmpassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((data) => data.password === data.confirmpassword, {
    path: ['confirmpassword'],
    message: 'Les mots de passe ne correspondent pas',
  })

// Activation de vee-validate avec le schema
useForm({
  validationSchema: toTypedSchema(schema),
})

// Gestion du champ password pour le PasswordStrength
const password = ref('')
const showPassword = ref(false)
const { value: passwordField } = useField('password')

watch(passwordField, (val) => (password.value = val as string))

// Composant force du mot de passe
const PasswordStrength = {
  props: {
    password: {
      type: String,
      required: true,
    },
  },
  setup(props: { password: string }) {
    const score = computed(() =>
      props.password ? zxcvbn(props.password).score : 0
    )
    const messages = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']
    const colors = ['#EF4444', '#F59E0B', '#EAB308', '#10B981', '#047857']

    return () =>
      h('div', { class: 'mt-1' }, [
        h('div', { class: 'w-full h-2 bg-gray-300 rounded' }, [
          h('div', {
            class: 'h-2 rounded transition-all duration-300',
            style: {
              width: `${((score.value + 1) / 5) * 100}%`,
              backgroundColor: colors[score.value],
            },
          }),
        ]),
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
