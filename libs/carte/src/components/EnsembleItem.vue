<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import ItemsDropdown from './ItemsDropdown.vue'
import { SquareX, PenLine, ChevronRight } from 'lucide-vue-next'
import { PinModel } from '../db/dbModels'

const props = defineProps({
  ensemble: Object,
  openMap: Object,
  focusId: String,
  renameOpen: Boolean,
  editName: String,
})

const emit = defineEmits([
  'toggleEnsemble',
  'deleteItems',
  'openRename',
  'renameItems',
  'dragstart',
  'drop',
  'clickPin',
  'update:editName',
])

const isOpen = computed(() => props.openMap?.[props.ensemble?.id] || false)

function onDragStartPin(pin : PinModel) {
  emit('dragstart', pin)
}

async function onDropOnEnsemble(event: any) {
  emit('drop', { ensembleId: props.ensemble?.id, event })
}
</script>

<template>
  <li 
    @dragover.prevent 
    @drop.prevent="onDropOnEnsemble"
    class="flex flex-col"
  >
    <div
      class="flex flex-row items-center justify-between cursor-pointer"
      @click="$emit('toggleEnsemble', props.ensemble?.id)"
    >
      <div class="flex items-center gap-2 text-white hover:text-gray-300">
        <ChevronRight
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-90': isOpen }"
        />
        <input
          v-if="focusId === ensemble?.id && renameOpen"
          class="italic"
          v-focus
          placeholder="New ensemble"
          @keydown.enter="emit('renameItems', ensemble)"
          @blur="emit('renameItems', ensemble)"
          v-model="editName"
        />
        <span v-else class="font-bold">{{ ensemble?.titre }}</span>
      </div>
      <div class="flex gap-1">
        <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" @click.stop="emit('deleteItems', ensemble)" />
        <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" @click.stop="emit('openRename', ensemble?.id)" />
      </div>
    </div>

    <div v-show="isOpen" class="border-l border-gray-200 ml-2 pl-2">
      <ItemsDropdown
        :pins="ensemble?.pins" 
        :open="true"
        :renameOpen="renameOpen"
        :focusId="focusId"
        :editName="editName"
        @dragstart="onDragStartPin"
        @delete="emit('deleteItems')"
        @rename="emit('renameItems')"
        @clickPin="emit('clickPin')"
        @update:editName="val => emit('update:editName', val)"
      />
      <ul>
        <EnsembleItem
          v-for="child in ensemble?.children"
          :key="child.id"
          :ensemble="child"
          :openMap="openMap"
          :focusId="focusId"
          :renameOpen="renameOpen"
          :editName="editName"
          @toggleEnsemble="$emit('toggleEnsemble', $event)"
          @deleteItems="$emit('deleteItems', $event)"
          @openRename="$emit('openRename', $event)"
          @renameItems="$emit('renameItems', $event)"
          @dragstart="$emit('dragstart', $event)"
          @drop="$emit('drop', $event)"
          @clickPin="$emit('clickPin', $event)"
          @update:editName="$emit('update:editName', $event)"
        />
      </ul>
    </div>
  </li>
</template>
