<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
    @dragover.prevent
    @dragenter.prevent
    @drop.prevent="handleDrop"
    @click="openFileChooser"
  >
    <p class="text-gray-500">Glisser-déposer une image ou cliquer pour choisir</p>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'update:modelValue': [string]
  'file-selected': [File]
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const openFileChooser = () => {
  fileInput.value?.click()
}

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    emit('file-selected', file)
  } else {
    alert('Fichier non valide')
  }
}

const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    emit('file-selected', file)
  } else {
    alert('Fichier non valide')
  }
}
</script>
