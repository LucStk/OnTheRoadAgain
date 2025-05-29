<template>
  <div class="btm-nav fixed text-black bottom-0 w-full z-50 bg-white px-6 py-4 shadow-md" style="height: 300px;">
    <div class="flex flex-wrap items-center justify-between h-full gap-4">

      <!-- Bloc gauche -->
      <div class="flex flex-col gap-1">
        <div class="text-xl font-semibold">{{ titre_étape }}</div>
        <div class="text-gray-600">{{ titre_parcours }}</div>
        <div>Jour {{ num_jour }} – Étape {{ num_étape }}</div>
        <div>{{ denivele }}</div>
        <div class="flex items-center gap-2">
          <div class="avatar">
            <div class="size-10 rounded-full overflow-hidden">
              <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar" />
            </div>
          </div>
          <span>{{ createur }}</span>
        </div>
      </div>

      <!-- Bloc tags -->
      <div class="flex flex-col items-start gap-2">
        <div id="tagline"><TagLine /></div>
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

const titre_étape = ref("Paris-Brest")
const titre_parcours = ref("Bretagne Express")
const num_étape = ref(3)
const num_jour = ref(1)
const denivele = ref("500m D+")
const tag = ref("cyclo")
const createur = ref("Jean Dupont")
const photos = ref("📸")
</script>
