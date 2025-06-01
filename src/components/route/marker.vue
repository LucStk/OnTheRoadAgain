<template>
  <div class="marker-content"
  @click="IndexStore.change_index(index)">
    📍
    <div
      class="flex size-4.5 items-center justify-center rounded-full"
      :class="IndexStore.index === index ? 'bg-blue-500' : 'bg-primary/20'"
      
    ></div>
  </div>
</template>

<script setup>
    import { ref,inject } from 'vue'
    import { useIndexStore } from '@/stores/global'
    const IndexStore = useIndexStore()

    const props = defineProps({
        index : Number
    });

    const handleClick = () => {
        console.log("Clicked marker:", props.index);
    };
</script>

<style scoped>
.marker-content {
  background-color: white;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
</style>
