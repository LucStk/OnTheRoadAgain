<script setup>
  import dataObject from '@/assets/data.json'
  import { useAuthStore } from '@/stores/auth';

  const auth = useAuthStore();

  onMounted(() => {
    auth.initialize(); // tente refresh ou fetch user
  });
</script>

<template>
  <Navbar />
  <RouterView />
</template>


