
<template>
  User connecté 
  {{ auth.username }}
  {{ auth.bio }}
</template>


<script setup lang="ts">
  import { useAuthStore } from '@repo/auth'
  const auth = useAuthStore();

  //Dans le cas où l'utilisateur est bien connecté mes ces informations ne sont pas 
  // dans l'objet auth.ts (ne devrait pas arriver mais tout de même)


</script>
