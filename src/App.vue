<script setup>
import Menu from './components/Menu.vue';
import Map from "./components/Map.vue";
import PathView from "./components/ÉtapeView.vue";
import SideBar from './components/SideBar.vue';
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <Map />
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
        <div class="bg-white border-t border-gray-300">
          <PathView />
        </div>
      </div>
    </div>
  </div>
</template>

