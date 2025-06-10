
<template>
  <div v-if="user" class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
    <div class="flex items-center space-x-4">
      <ProfilePhoto />
      <div>
        <h2 class="text-2xl font-semibold">{{ user.username }}</h2>
        <p class="text-gray-500">{{ user.ville }}, {{ user.pays }}</p>
      </div>
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
