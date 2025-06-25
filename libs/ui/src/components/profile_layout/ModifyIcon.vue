<template>
    <button
    @click="triggerEdit"
    class="absolute -bottom-1 -right-1 
            bg-white rounded-full 
            border-2 border-base-content/10
            p-1 shadow cursor-pointer"
    aria-label="Edit profile"
    >
    <PencilIcon class="w-4 h-4 text-gray-600" />
    <ProfilePhoto v-if="showCropper" @close="showCropper = false" @update:modelValue="handleCroppedImage"/>
    </button>
</template>

<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '@repo/auth'
import { ref } from 'vue'

const auth = useAuthStore();
console.log(auth)

import ProfilePhoto from './ProfilePhoto.vue';
//Dans le cas où l'utilisateur est bien connecté mes ces informations ne sont pas 
// dans l'objet auth.ts (ne devrait pas arriver mais tout de même)
const showCropper = ref(false)

const handleCroppedImage = (base64: string) => {
    showCropper.value = false
    auth.photo_profil = base64
}

const triggerEdit = () => {
  showCropper.value = true
}
</script>