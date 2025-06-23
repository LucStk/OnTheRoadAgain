
<template>
  <div v-if="auth.isUserLoaded" class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
    <div class="flex-col items-center space-x-4">

        <div class="avatar">
            <div class="size-15 rounded-full">
                <img  v-if="auth.photo_profil" :src="auth.photo_profil.value"></img>
                <span v-else class="text-4xl icon-[solar--user-circle-bold-duotone]"></span>
            </div>
        </div>
      <h2 class="text-2xl font-semibold">{{ auth.username }}</h2>

      <p v-if="auth.ville" class="text-gray-500">Ville : {{ auth.ville }}</p>
      <p v-if="auth.pays" class="text-gray-500">Pays : {{ auth.pays }}</p>
      <p v-if="auth.bio" class="text-gray-500">Bio : {{ auth.bio }}</p>
      <p v-if="auth.date_naissance" class="text-gray-500">Date de naissance : {{auth.date_naissance }}</p>
      <p v-if="auth.email" class="text-gray-500">Email : {{ auth.email }}</p>

      <a class="btn" href="/profile/update">Modifier</a>

    </div>
  </div>
</template>


<script setup lang="ts">
  definePage({
    meta: {requiresAuth: true,},
  })
  import { useAuthStore } from '@repo/auth'
  const auth = useAuthStore();

  //Dans le cas où l'utilisateur est bien connecté mes ces informations ne sont pas 
  // dans l'objet auth.ts (ne devrait pas arriver mais tout de même)

</script>
