
<template>
  User connecté 
  {{ auth.username }}
  {{ auth.bio }}
</template>


<script setup lang="ts">
  const auth = useAuthStore();

  const username = ref('')
  const password = ref('')
  const error = ref(null)
  const loading = ref(false)
  const router = useRouter()

  //Dans le cas où l'utilisateur est bien connecté mes ces informations ne sont pas 
  // dans l'objet auth.ts (ne devrait pas arriver mais tout de même)
  
  


</script>
