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

<script setup>


defineProps({
  modelValue: String // base64 ou URL d'image
})
const emit = defineEmits(['update:modelValue'])

const cropper = ref(null)
const input = ref(null)
const imgSrc = ref('')
const cropImg = ref('')

// Affiche le file picker
function showFileChooser() {
  input.value.click()
}

// Charge et affiche l'image dans le cropper
function loadImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    alert('Veuillez sélectionner un fichier image valide.')
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    imgSrc.value = event.target.result
    cropper.value.replace(event.target.result)
  }
  reader.readAsDataURL(file)
}

// Gère l'upload
function setImage(event) {
  loadImage(event.target.files[0])
}

// Drag & Drop
function handleDrop(event) {
  loadImage(event.dataTransfer.files[0])
}

// Crop et émet au parent
function cropImage() {
  const canvas = cropper.value.getCroppedCanvas()
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