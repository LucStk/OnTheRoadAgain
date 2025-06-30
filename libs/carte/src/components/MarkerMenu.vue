<script setup lang="ts">
  import { defineProps , type Ref} from 'vue'
  defineProps<{ 
    visible: Ref<boolean>
    setPin: () => void
    setOrigin: () => void
    setDestination: () => void
  }>()

</script>

<template>
  <div v-show="visible.value" class="marker-menu">
    <div class="menu bg-amber-50 text-black flex flex-row rounded-md">
      <button class=" 
        cursor-pointer 
        bg-green-400 
        text-white btn-sm
        w-6 h-6
        " 
        @click="setPin"
        data-type="default">
    📍</button>
      <div class="
        w-6 h-6 bg-blue-300 
        overflow-hidden 
        cursor-pointer " @click="setOrigin">
        <img
          src="../assets/origin.svg"
          alt="origin"
          class="w-full h-auto my-auto"
        />
      </div>
        <div class="
          w-6 h-6 bg-blue-300 
          overflow-hidden 
          cursor-pointer" @click="setDestination">
          <img
            src="../assets/destination.svg"
            alt="origin"
            class="w-full h-auto my-auto"
          />
      </div>
    </div>
  </div>
</template>

