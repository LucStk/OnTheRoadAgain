<template>
  <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
    <div class="flex items-center space-x-4">
      <img
        v-if="user.photo_profil"
        :src="user.photo_profil"
        alt="Photo de profil"
        class="w-24 h-24 rounded-full object-cover"
      />
      <div>
        <h2 class="text-2xl font-semibold">{{ user.username }}</h2>
        <p class="text-gray-500">{{ user.ville }}, {{ user.pays }}</p>
      </div>
    </div>

    <div class="mt-6 space-y-2">
      <p><strong>Date de naissance :</strong> {{ formatDate(user.date_naissance) }}</p>
      <p><strong>Bio :</strong> {{ user.bio || 'Aucune bio disponible.' }}</p>
      <p v-if="user.email"><strong>Email :</strong> {{ user.email }}</p>
      <p v-if="user.nom_complet"><strong>Nom complet :</strong> {{ user.nom_complet }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/token.js'

const route = useRoute()
const user = ref({})

onMounted(async () => {
  try {
    const username = route.params.username
    const endpoint = username ? `users/${username}/` : `users/me/`

    const response = await api.get(endpoint)
    user.value = response.data
  } catch (error) {
    console.error("Erreur lors du chargement du profil :", error)
  }
})


function formatDate(dateStr) {
  if (!dateStr) return 'Non renseignée'
  return new Date(dateStr).toLocaleDateString()
}

</script>
