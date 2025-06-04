<script setup>
  import dataObject from '@/assets/data.json'
  import { provide, ref } from 'vue'

  const data = ref(dataObject)
  provide("road", data)
</script>

<template>
  <RouterView />
</template>


