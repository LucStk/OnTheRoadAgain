<template>
  <div class="flex flex-col md:flex-row md:items-center gap-2">
    <label for="password" class="input-custom-label-inline">
      Password
    </label>
    <div class="md:w-2/3 w-full">
      <Field
        name="password"
        type="password"
        id="password"
        placeholder="••••••••"
        class="input-custom-inline"
        v-slot="{ field }"
      >
        <input v-bind="field" class="input-custom-inline" />
      </Field>

      <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
      <PasswordStrength :password="password" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage, useField } from 'vee-validate'
import { ref, watch, computed, h } from 'vue'
import zxcvbn from 'zxcvbn'

// Réf externe
const password = ref<string>('')

// Liaison avec vee-validate
const { value } = useField('password')

// Sync entre vee-validate et ta ref
watch(value, 
    (v) => {
        (password.value = v as string)}
)

// Password strength component
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