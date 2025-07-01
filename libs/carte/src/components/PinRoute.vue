<template>
  <div class="" @click="">
    <div
      class="flex 
          cursor-pointer
          size-7 items-center 
          justify-center 
          rounded-full bg-black"
    >
        x
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    destroy: () => void;
  }>();
  
</script>
