<script setup>
import Menu from './components/layout/menu.vue';
import SideBar from './components/layout/SideBar.vue';
import Map from "./components/map.vue";
import dataObject from '@/assets/data.json'
import { provide, ref } from 'vue'

const data = ref(dataObject)
provide("road", data)

</script>

<template>
  <Menu/>
  
  <div class="h-screen flex flex-col">
    <Map />
  </div>
  <SideBar/>
  
</template>


