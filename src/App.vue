<script setup>
  import dataObject from '@/assets/data.json'
  import Navbar from '@/Navbar.vue';
  import { provide, ref } from 'vue'

  const data = ref(dataObject)
  provide("road", data)
</script>

<template>
  <Navbar/>
  <RouterView />
</template>


