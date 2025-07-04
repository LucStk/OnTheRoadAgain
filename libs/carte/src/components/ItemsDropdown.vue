<template>
  <Transition name="fade" mode="out-in">
    <ul v-if="open" class="text-sm">
      <li
        v-for="pin in pins"
        :key="pin.id"
        class="flex flex-row items-center justify-between cursor-pointer"
        draggable="true"
        @dragstart="emit('dragstart', pin)"
      >
        <div class="
          flex items-center 
          gap-2 text-white
          hover:text-gray-300 grow"
          @click="emit('clickPin', pin)">
          <MapPin v-if="pin.type === 'pin'" class="w-3.5 h-3.5" />
          <Route v-if="pin.type === 'route'" class="w-3.5 h-3.5" />
          <input
            v-if="renameOpen && focusId === pin.id"
            class="italic bg-transparent border-b border-white w-full"
            v-focus
            placeholder="New pin name"
            @keydown.enter="onRename(pin)"
            @blur="onRename(pin)"
            :value="props.editName"
            @input="emit('update:editName', ($event.target as HTMLInputElement).value)"
          />
          <span v-else class="font-bold truncate w-full">{{ pin.titre }}</span>
        </div>
        <div class="flex gap-1">
          <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" @click.stop="emit('delete', pin);" />
          <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" @click.stop="openRenamePin(pin)" />
        </div>
        <RouteDropdown
          v-if="pin.type === 'route'"
          :points="pin.pins.map(id => syncStore.pins[id]).filter(p => p)"
          :routeId="pin.id"
          :open="openMap[pin.id]"
          @dragstartPoint="onDragStartPoint"
          @removePoint="removePointFromRoute"
        />

      </li>
    </ul>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import RouteDropdown from "./RouteDropdown.vue";
import { MapPin, SquareX, PenLine,Route } from 'lucide-vue-next';
import type { BaseModel } from '../db/dbApp';

const props = defineProps({
  pins: {
    type: Array as PropType<BaseModel[]>,
    required: true,
  },
  open: Boolean,
  renameOpen: Boolean,
  focusId: String,
  editName: String,
});

const emit = defineEmits([
  'dragstart', 
  "clickPin", 
  'delete', 
  'rename', 
  'update:editName'
]);


function openRenamePin(pin: BaseModel) {
  emit('rename', pin.id);
  emit('update:editName', pin.titre);
}

function onRename(pin: BaseModel) {
  emit('rename', null); // Close rename
  pin.update?.({ titre: props.editName });
  emit('update:editName', ''); // reset
}

</script>

<script lang="ts">
export default {
  directives: {
    focus: {
      mounted(el: HTMLInputElement) {
        el.focus();
      },
      updated(el: HTMLInputElement) {
        el.focus();
      },
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
