<script setup>
  import dataObject from '@/assets/data.json'
  import { useAuthStore } from '@/stores/auth';

  const data = ref(dataObject)
  provide("road", data)

  const auth = useAuthStore();

  onMounted(() => {
    if (auth.access) {
      auth.fetchUser(); // 👈 charge user si déjà loggué
    }
  });
</script>

<template>
  <Navbar />
  <RouterView />
</template>


