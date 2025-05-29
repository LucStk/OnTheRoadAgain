<template>
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
</template>

<script setup>
import { ref } from 'vue'

const titre_étape = ref("Paris-Brest")
const titre_parcours = ref("Bretagne Express")
const num_étape = ref(3)
const num_jour = ref(1)
const denivele = ref("500m D+")
const tag = ref("cyclo")
const createur = ref("Jean Dupont")
const photos = ref("📸")
</script>
