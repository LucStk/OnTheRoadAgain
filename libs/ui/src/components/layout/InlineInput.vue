
<template>
    <div :key="name" class="flex flex-col md:flex-row md:items-center gap-2">
        <label :for="name" class="input-custom-label-inline">
        {{ label }}
        </label>
        <div class="field-cont md:w-2/3 w-full">
        <Field
            :name="name"
            :type="type"
            :placeholder="placeholder"
            :id= "name"
            class="input-custom-inline"
        />
        <ErrorMessage :name="name" class="text-red-500 text-sm mt-1" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'

defineProps<{  name: string, label: string, type: string, placeholder: string }>()
</script>