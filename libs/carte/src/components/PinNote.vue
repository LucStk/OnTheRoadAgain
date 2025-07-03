<template>
  <div class="cursor-pointer" @click="handleClick">
    <div
      class="flex size-8 text-2xl items-center justify-center rounded-full"
    > 📍</div>
  </div>
</template>

<script setup lang="ts">
  import type {PinDataLike} from "../types/db-types.ts";
  const props = defineProps<{
    data: PinDataLike;
    destroy: () => void;
  }>();
  
  const handleClick = () => {
    props.destroy()
  };
</script>
