<script setup>
import Menu from './components/menu.vue';
import Map from "./components/map.vue";
import dataObject from '@/assets/data.json'
import { provide, ref } from 'vue'

const data = ref(dataObject)
provide("road", data)

</script>

<template>
  <div class="h-screen flex flex-col">
    <Map />
  </div>
</template>


