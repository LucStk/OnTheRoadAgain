<template>
  <div v-if="auth.isUserLoaded" class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md text-black">
    <div class="flex flex-col items-center justify-center space-y-4">
      <ProfileIcon />
      <h2 class="text-2xl font-semibold">{{ auth.username }}</h2>
      <p v-if="auth.ville" class="text-gray-500">Ville : {{ auth.ville }}</p>
      <p v-if="auth.pays" class="text-gray-500">Pays : {{ auth.pays }}</p>
      <p v-if="auth.bio" class="text-gray-500">Bio : {{ auth.bio }}</p>
      <p v-if="auth.date_naissance" class="text-gray-500">Date de naissance : {{ auth.date_naissance }}</p>
      <p v-if="auth.email" class="text-gray-500">Email : {{ auth.email }}</p>
      <a class="btn" href="/profile/update">Modifier</a>
    </div>
    
  </div>
</template>


<script setup lang="ts">
  import { useAuthStore } from '@repo/auth'
  import ProfileIcon from './ProfileIcon.vue';
  const auth = useAuthStore();
</script>
