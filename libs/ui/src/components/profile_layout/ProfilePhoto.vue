<template>
  <div>
    <!-- Zone de drag and drop -->
    <div class="border-2 
      border-dashed border-gray-400 
      rounded-lg p-6 
      text-center 
      cursor-pointer"

      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="showFileChooser">


      <p class="text-gray-500">Glisse-dépose une image ici ou clique pour choisir</p>
      
      <input ref="input" 
            type="file" 
            name="image" 
            class="hidden" 
            @change="setImage" 
            accept="image/*" />
    
    </div>
    <section class="cropper-area">
      <div class="img-cropper">
        <VueCropper
          ref="cropper"
          :aspect-ratio="1 / 1"
          :src="imgSrc"
          preview=".preview"
          @ready="cropImage"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueCropper from 'vue-cropperjs'

const emit = defineEmits(['update:modelValue'])

type CropperInstance = {
    replace: (url: string) => void
    getCroppedCanvas: () => HTMLCanvasElement | null
}

type CropperComponent = {
  cropper: CropperInstance
} | null

const cropper = ref<CropperComponent>(null)

const input = ref<HTMLInputElement | null>(null)
const imgSrc = ref<string>('') // pas `null` ni `ArrayBuffer`
const cropImg = ref('')

// Affiche le file picker
function showFileChooser() {
  input.value?.click()
}


// Charge et affiche l'image dans le cropper
function loadImage(file: Blob) {
  if (!file || !file.type.startsWith('image/')) {
    alert('Veuillez sélectionner un fichier image valide.')
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    const result = event.target?.result
    if (typeof result === 'string') {
      imgSrc.value = result
      cropper.value?.cropper.replace(result)
    }
  }
  reader.readAsDataURL(file)
}

// Gère l'upload
function setImage(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    loadImage(target.files[0])
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault() // important pour empêcher le comportement par défaut (ex: ouvrir le fichier)
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    loadImage(files[0])
  }
}

// Crop et émet au parent
function cropImage() {
  const canvas = cropper.value?.cropper.getCroppedCanvas()
  if (canvas) {
    const cropped = canvas.toDataURL()
    cropImg.value = cropped
    emit('update:modelValue', cropped) // 🔁 Remonte l'image croppée
  }
}
</script>

<style>
.preview-area {
  width: 20px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.preview {
  width: 20%;
  height: 20%;
  overflow: hidden;
}

</style>