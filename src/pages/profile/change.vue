<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import flatPickr from 'vue-flatpickr-component'
import VueCropperImport from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import 'flatpickr/dist/flatpickr.css'

definePage({ meta: { requiresAuth: true } })

const VueCropper = VueCropperImport.default || VueCropperImport

const config = { wrap: true, altFormat: 'Y-m-d', altInput: true, dateFormat: 'Y-m-d' }

const auth = useAuthStore()
const user = auth.user

const input   = ref<HTMLInputElement | null>(null)
const cropper = ref<any>(null)
const imgSrc  = ref(user?.photo_profil || "")
const cropImg = ref('') // image croppée au format base64
const error   = ref('')
const loading = ref(false)

// Remplacement de reactive par refs individuelles
const date_naissance = ref(user?.date_naissance ? new Date(user.date_naissance) : null)
const bio   = ref(user?.bio   || '')
const pays  = ref(user?.pays  || '')
const ville = ref(user?.ville || '')

function showFileChooser() {
  if (input.value) input.value.click()
}

function loadImage(file: File) {
  if (!file || !file.type.startsWith('image/')) {
    alert('Veuillez sélectionner un fichier image valide.')
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    imgSrc.value = event.target?.result as string
  }
  reader.readAsDataURL(file)
}

function setImage(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    loadImage(target.files[0])
  }
}

function handleDrop(event: DragEvent) {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    loadImage(event.dataTransfer.files[0])
  }
}

watch(imgSrc, async (newSrc) => {
  if (cropper.value && newSrc) {
    await nextTick()
    cropper.value.replace(newSrc)
  }
})

function cropImage() {
  if (!cropper.value) return
  const canvas = cropper.value.getCroppedCanvas()
  if (canvas) {
    const cropped = canvas.toDataURL('image/png')
    cropImg.value = cropped
    emit('update:modelValue', cropped)
  }
}

const emit = defineEmits(['update:modelValue'])

async function handleUpdate() {
  error.value = ''
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('date_naissance', date_naissance.value ? date_naissance.value.toISOString().split('T')[0] : '')
    formData.append('bio', bio.value)
    formData.append('pays', pays.value)
    formData.append('ville', ville.value)
    if (cropImg.value) {
      const blob = await (await fetch(cropImg.value)).blob()
      formData.append('photo_profil', blob, 'photo.png')
    }

    const response = await api.patch('profile/patch/', formData)
    if (response) {
      await auth.fetchUser()
    } else {
      error.value = 'Erreur lors de la mise à jour.'
    }
  } catch (err) {
    error.value = 'Erreur réseau ou serveur.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="user" class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
    <div class="flex flex-col items-center space-x-4">
      <h2 class="text-2xl font-semibold">{{ user.username }}</h2>

      <div>
        <div
          class="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="showFileChooser"
        >
          <p class="text-gray-500">Glisse-dépose une image ici ou clique pour choisir</p>
          <input
            ref="input"
            type="file"
            name="image"
            class="hidden"
            @change="setImage"
            accept="image/*"
          />
        </div>

        <section class="cropper-area mt-4">
          <div class="img-cropper">
            <VueCropper
              ref="cropper"
              :aspect-ratio="1"
              :src="imgSrc"
              preview=".preview"
              @ready="cropImage"
            />
          </div>
        </section>
      </div>

      <form @submit.prevent="handleUpdate" class="mt-6">
        <div class="w-96 mb-4">
          <label class="label-text" for="villeInput">Ville</label>
          <input v-model="ville" type="text" placeholder="Paris" class="input" id="villeInput" />
        </div>

        <div class="w-96 mb-4">
          <label class="label-text" for="paysInput">Pays</label>
          <input v-model="pays" type="text" placeholder="France" class="input" id="paysInput" />
        </div>

        <label class="label-text" for="bioInput">Bio</label>
        <div class="textarea max-w-sm mb-4">
          <div class="textarea-floating grow">
            <textarea v-model="bio" class="resize-none" placeholder="Ma bio" id="bioInput"></textarea>
          </div>
        </div>

        <label class="label-text" for="dateInput">Date de naissance</label>
        <flat-pickr
          v-model="date_naissance"
          :config="config"
          class="form-control mb-6"
          placeholder="Select date"
          name="date"
          id="dateInput"
        />

        <button type="submit" :disabled="loading" class="btn btn-success btn-block">
          Modifier
        </button>
        <a class="btn btn-success btn-block" href="/profile">Annuler</a>

        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>
