<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white relative rounded-xl w-full max-w-2xl shadow-xl p-6 space-y-6">
        <!-- Bouton fermeture -->
          <button 
          @click="emit('close')"
          class="cursor-pointer 
                absolute -top-4 -right-4  hover:text-black 
                ">
          <XMarkIcon class="w-5 h-5 text-black bg-white rounded-full" />
        </button>
        <!-- Zone de crop uniquement si une image est chargée -->
        <div v-if="imgSrc" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div class="aspect-square border rounded overflow-hidden relative">
            <Cropper
              ref="cropperRef"
              :src="imgSrc"
              :stencil-Component="CircleStencil"
              :stencil-props="{ aspectRatio: 1 }"
              :auto-zoom="true"
              :class="{ 'cropper-ready': isReady }"
              @ready="onReady"
            />
          </div>
          <div>
            <p class="text-sm font-medium mb-2">Prévisualisation :</p>
            <div
              class="preview w-40 h-40 border rounded-full overflow-hidden"
              v-if="croppedDataUrl"
            >
              <img :src="croppedDataUrl" alt="Preview" class="w-full h-full object-cover" />
            </div>

            <button
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              :disabled="!isReady"
              @click="confirmCrop"
            >
              Valider
            </button>
          </div>
        </div>

        <!-- Zone d'upload -->
        <DropZone @file-selected="onFileSelected" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import DropZone from './DropZone.vue'
import { ref } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import 'vue-advanced-cropper/dist/style.css'

const emit = defineEmits<{
  'update:modelValue': [string]
  'close': []
}>()

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
const imgSrc = ref<string>('')
const croppedDataUrl = ref<string | null>(null)
const isReady = ref(false)

const onFileSelected = (file: File) => {
  const reader = new FileReader()
  reader.onload = () => {
    imgSrc.value = reader.result as string
    croppedDataUrl.value = null
    isReady.value = false
  }
  reader.readAsDataURL(file)
}

const onReady = () => {
  isReady.value = true
}

import { useAuthStore } from '@repo/auth'
const auth = useAuthStore()
const confirmCrop = () => {
  if (!cropperRef.value) return
  const canvas = cropperRef.value.getResult().canvas
  if (canvas) {
    const base64 = canvas.toDataURL()
    croppedDataUrl.value = base64
    auth.photo_profil = base64
    //auth.photo_profil.value = base64
    emit('update:modelValue', base64)
    emit("close")
  }
}
</script>

<style scoped>
.preview {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
}

.cropper-ready :deep(.vue-advanced-cropper__stencil) {
  border-radius: 50% !important;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
</style>
