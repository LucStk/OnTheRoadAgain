<template>
  <div>
    <!-- Zone de drag and drop -->
    <div
      class="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="showFileChooser"
    >
      <p class="text-gray-500">Glisse-dépose une image ici ou clique pour choisir</p>
      <input ref="input" 
            type="file" 
            name="image" 
            class="hidden" 
            @change="setImage" 
            accept="image/*" />
    </div>

    <div class="content flex-col">
      <section class="cropper-area">
        <div class="img-cropper">
          <VueCropper
            ref="cropper"
            :aspect-ratio="16 / 9"
            :src="imgSrc"
            preview=".preview"
          />
        </div>
        <textarea v-model="data" />
      </section>

      <section class="preview-area">
        <p>Preview</p>
        <div class="preview" />
      </section>
    </div>
  </div>
</template>

<script setup>
    import VueCropper from 'vue-cropperjs'
    import 'cropperjs/dist/cropper.css'

    const cropper = ref(null)
    const input = ref(null)

    const imgSrc = ref('')
    const cropImg = ref('')
    const data = ref('')

    function showFileChooser() {input.value.click()}

    function loadImage(file){
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

    function setImage(event) {loadImage(event.target.files[0])}
    function handleDrop(event) { loadImage(event.dataTransfer.files[0])}

    function cropImage() {
        const canvas = cropper.value.getCroppedCanvas()
        if (canvas) {
            cropImg.value = canvas.toDataURL()
        }
    }

</script>

<style>
.preview-area {
  width: 307px;
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
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}

</style>