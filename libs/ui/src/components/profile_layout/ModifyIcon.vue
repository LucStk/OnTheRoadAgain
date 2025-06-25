<template>
    <button
    @click="() => {showCropper = true}"
    class="absolute -bottom-1 -right-1 
            bg-white rounded-full 
            border-2 border-base-content/10
            p-1 shadow cursor-pointer"
    aria-label="Edit profile"
    >
    <PencilIcon class="w-4 h-4 text-gray-600" />
    <LoadPhoto v-if="showCropper" @close="showCropper = false"/>
    </button>
</template>

<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import LoadPhoto from './LoadPhoto.vue'

const showCropper = ref(false)
</script>