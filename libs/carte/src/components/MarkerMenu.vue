<script setup lang="ts">
  const props = defineProps<{
    visible: boolean;
    lngLat: [number, number];
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'set-pin', lngLat: [number, number]): void;
    (e: 'set-origin', lngLat: [number, number]): void;
    (e: 'set-destination', lngLat: [number, number]): void;
  }>();

  const setPin = () => emit('set-pin', props.lngLat);
  const setOrigin = () => emit('set-origin', props.lngLat);
  const setDestination = () => emit('set-destination', props.lngLat);
</script>

<template>
  <div v-show="visible" class="marker-menu">
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

