<template>
  <div class="btm-nav fixed text-black bottom-0 w-full z-50 bg-white px-6 py-4 shadow-md" style="height: 300px;">
    <div class="flex flex-wrap items-center justify-between h-full gap-4">

      <!-- Bloc gauche -->
      <EtapeInfo />
      <TagLine />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TagLine from "./route.vue"
import EtapeInfo from './infos.vue'
</script>
