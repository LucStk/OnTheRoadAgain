<template>
  <div v-if="auth.isUserLoaded" class="max-w-2xl mx-auto mt-8 p-6 bg-white 
  rounded-2xl shadow-md text-black">
    <div class="flex flex-col items-center justify-center space-y-4">
      <ProfileIcon />
      <h2 class="text-2xl font-semibold">{{ auth.username }}</h2>
      <p v-if="auth.ville" class="text-gray-500">Ville : {{ auth.ville }}</p>
      <p v-if="auth.pays" class="text-gray-500">Pays : {{ auth.pays }}</p>
      <p v-if="auth.bio" class="text-gray-500">Bio : {{ auth.bio }}</p>
      <p v-if="auth.date_naissance" class="text-gray-500">Date de naissance : {{ auth.date_naissance }}</p>
      <p v-if="auth.email" class="text-gray-500">Email : {{ auth.email }}</p>
      <button class="btn" @click="handleUpdate">Modifier</button>
    </div>
    
  </div>
</template>


<script setup lang="ts">
  import { useAuthStore, api } from '@repo/auth'
  import ProfileIcon from './ProfileIcon.vue';
  import {provide, ref } from 'vue'
  const auth = useAuthStore();

  const error   = ref('')
  const loading = ref(false)

  function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    const u8arr = new Uint8Array(bstr.length)
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const configDate = { wrap: true, altFormat: 'Y-m-d', altInput: true, dateFormat: 'Y-m-d' }
  const userDate = auth.date_naissance ? new Date(auth.date_naissance) : new Date();
  const date_naissance = ref(userDate);
  const bio   = ref(auth.bio   || '')
  const pays  = ref(auth.pays  || '')
  const ville = ref(auth.ville || '')
  const imgSrc  = ref(auth.photo_profil ? auth.photo_profil : "")

  provide("imgSrc", imgSrc)
  provide("date_naissance", date_naissance)
  provide("bio", bio)
  provide("pays", pays)
  provide("ville", ville)


  async function handleUpdate() {
    error.value = ''
    loading.value = true

    const formData = new FormData()
    if (imgSrc.value) {
      formData.append('photo_profil', base64ToFile(imgSrc.value, 'avatar.png'))
    }
    console.log(formData)
    
    try {
      console.log("lets")
      await auth.patchUser(formData)
      await auth.fetchUser()
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour.'
    }

  }

</script>
