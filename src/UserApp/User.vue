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
        <h2 class="text-2xl font-semibold">{{ user.nom_complet || user.username }}</h2>
        <p class="text-gray-500">{{ user.ville }}, {{ user.pays }}</p>
      </div>
    </div>

    <div class="mt-6 space-y-2">
      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Date de naissance :</strong> {{ formatDate(user.date_naissance) }}</p>
      <p><strong>Genre :</strong> {{ genreLabel(user.genre) }}</p>
      <p><strong>Niveau de marche :</strong> {{ niveauLabel(user.niveau_marche) }}</p>
      <p><strong>Bio :</strong> {{ user.bio || 'Aucune bio disponible.' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref({})

onMounted(async () => {
  try {
    const response = await axios.get('/api/profil/') // Adapte l'URL à ton backend
    user.value = response.data
  } catch (error) {
    console.error("Erreur lors du chargement du profil :", error)
  }
})

function formatDate(dateStr) {
  if (!dateStr) return 'Non renseignée'
  return new Date(dateStr).toLocaleDateString()
}

function genreLabel(code) {
  const map = { M: 'Homme', F: 'Femme', O: 'Autre' }
  return map[code] || 'Non spécifié'
}

function niveauLabel(code) {
  const map = { D: 'Débutant', I: 'Intermédiaire', A: 'Avancé' }
  return map[code] || 'Non spécifié'
}
</script>

<style scoped>
/* Tu peux ajouter du style ici si tu veux */
</style>
