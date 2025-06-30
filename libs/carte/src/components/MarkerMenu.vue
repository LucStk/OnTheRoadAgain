<script setup lang="ts">
  import { defineProps , type Ref} from 'vue'
  const props = defineProps<{ 
    visible: Ref<boolean>
    setPin: () => void
  }>()

  const handleClick = () => {
    console.log('click menu')
    props.setPin()
  };
</script>

<template>
  <div v-show="visible.value" class="marker-menu">
    <div class="menu bg-amber-50 text-black flex flex-row rounded-md">
      <button class=" 
            cursor-pointer 
            bg-green-400 
            text-white btn-sm" 
            @click="setPin"
            data-type="default">
        📍</button>
      <button data-type="danger">⚠️</button>
      <button data-type="info">ℹ️</button>
    </div>
  </div>
</template>

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
