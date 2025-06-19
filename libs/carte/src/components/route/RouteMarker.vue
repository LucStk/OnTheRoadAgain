<template>
  <div class="marker-content">
    📍
    <div
      class="flex size-4.5 items-center justify-center rounded-full bg-primary/20'"
    ></div>
  </div>

  <!--
  <div class="marker-content"
  @click="IndexStore.change_index(index)">
    📍
    <div
      class="flex size-4.5 items-center justify-center rounded-full"
      :class="IndexStore.index === index ? 'bg-blue-500' : 'bg-primary/20'"
      
    ></div>
  </div>
  -->

</template>

<script setup lang="ts">
    //import { ref } from 'vue';

    //const IndexStore = ref(0);
    /*
    const props = defineProps({
      index: {
        type: Number,
        required: true,
      }
    });
    
    const handleClick = () => {
        console.log("Clicked marker:", props.index);
    };*/
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
