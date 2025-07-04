<template>
  <Transition name="fade" mode="out-in">
    <ul v-if="open" class="text-sm ml-5 border-l border-gray-600 pl-2">
      <li
        v-for="(pin, index) in points"
        :key="pin.id"
        class="flex justify-between items-center cursor-pointer"
        draggable="true"
        @dragstart="emit('dragstartPoint', { pin, routeId })"
      >
        <div
          class="flex items-center gap-2 text-white hover:text-gray-300 grow"
          @click="emit('clickPin', pin)">
          <MapPin class="w-3.5 h-3.5" />
          <span class="truncate w-full">{{ pin.titre }}</span>
        </div>
        <div class="flex gap-1">
          <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700"
            @click.stop="emit('removePoint', { pin, routeId })" />
        </div>
      </li>
    </ul>
  </Transition>
</template>

<script setup lang="ts">
import type { BaseModel } from '../db/dbApp';
import { MapPin, SquareX } from 'lucide-vue-next';
import { type PropType } from 'vue';

const props = defineProps({
  points: { type: Array as PropType<BaseModel[]>, required: true },
  routeId: { type: String, required: true },
  open: Boolean,
});
const emit = defineEmits(['dragstartPoint', 'removePoint', 'clickPin']);
</script>
