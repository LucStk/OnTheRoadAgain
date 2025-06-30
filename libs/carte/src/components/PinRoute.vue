<template>
  <div class="" @click="">
    <div
      class="flex size-4.5 items-center justify-center rounded-full bg-black"
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
