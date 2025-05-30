<script setup>
import Menu from './components/Menu.vue';
import Map from "./components/Map.vue";
import SideBar from './components/layout/SideBar.vue';
import dataObject from '@/assets/data.json'

import { provide, ref } from 'vue'

const data = ref(dataObject)
provide("road", data)

</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <Map />
      <div class="bg-white border-t border-gray-300">
        <EtapeView />
      </div>
  </div>
</template>

{{ /* 
  <Menu />
    <!-- Main layout: Sidebar + Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar à gauche -->
      <div class="w-64 bg-gray-100 border-r border-gray-300 flex-shrink-0">
        <SideBar />
      </div>

      <!-- Zone principale -->
      <div class="flex-1 flex flex-col justify-end">
        <!-- PathView alignée en bas -->

      </div>
    </div>
  */}}