<template>
  <button 
    @click="onclick"
    class="cursor-pointer 
           absolute top-4 right-4 
           text-gray-500 hover:text-black 
           text-2xl font-bold">
    ×
  </button>
</template>

<script setup lang="ts">
defineProps<{ onclick: () => void }>()
</script>