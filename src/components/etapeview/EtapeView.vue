<template>
  <div class="btm-nav fixed text-black bottom-0 w-full z-50 bg-white px-6 py-4 shadow-md" style="height: 300px;">
    <div class="flex flex-wrap items-center justify-between h-full gap-4">

      <!-- Bloc gauche -->
      <EtapeInfo />
      <TagLine />

      <!-- Bloc tags -->
      <div class="flex flex-col items-start gap-2">
        
        <div>{{ tag }}</div>
        <button id="addtag" class="btn btn-sm btn-outline">Ajouter tag</button>
      </div>

      <!-- Bloc photos -->
      <div class="text-4xl">{{ photos }}</div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TagLine from "./TagLine.vue"
import EtapeInfo from './EtapeInfo.vue'
</script>
