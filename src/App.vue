<script setup>
  const auth = useAuthStore();

  onMounted(() => {
    auth.initialize(); // tente refresh ou fetch user
  });
</script>

<template>
  <Navbar />
  <RouterView />
</template>


