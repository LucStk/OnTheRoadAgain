
<template>
  <div v-if="user" class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
    <div class="flex-col items-center space-x-4">

        <div class="avatar">
            <div class="size-15 rounded-full">
                <img  v-if="user && user.photo_profil" :src="user.photo_profil"></img>
                <span v-else class="text-4xl icon-[solar--user-circle-bold-duotone]"></span>
            </div>
        </div>
      <h2 class="text-2xl font-semibold">{{ user.username }}</h2>

      <p v-if="user.ville" class="text-gray-500">Ville : {{ user.ville }}</p>
      <p v-if="user.pays" class="text-gray-500">Pays : {{ user.pays }}</p>
      <p v-if="user.bio" class="text-gray-500">Bio : {{ user.bio }}</p>
      <p v-if="user.date_naissance" class="text-gray-500">Date de naissance : {{ user.date_naissance }}</p>
      <p v-if="user.email" class="text-gray-500">Email : {{ user.email }}</p>

      <a class="btn" href="/profile/change">Modifier</a>

    </div>
  </div>
</template>


<script setup lang="ts">
  definePage({
    meta: {requiresAuth: true,},
  })
  const auth = useAuthStore();
  const user = auth.user;

  const username = ref('')
  const password = ref('')
  const error = ref(null)
  const loading = ref(false)
  const router = useRouter()

  //Dans le cas où l'utilisateur est bien connecté mes ces informations ne sont pas 
  // dans l'objet auth.ts (ne devrait pas arriver mais tout de même)

</script>
