<template>
  <li class="flex flex-col">
    <div class="flex flex-row items-center justify-between cursor-pointer">
      <div class="flex items-center gap-2 text-white hover:text-gray-300">
        <ChevronRight class="w-4 h-4 transition-transform duration-200"/>
        <input
          v-if="explorerStore.focusId === ensemble?.id && explorerStore.renameOpen"
          class="italic"
          v-focus
          placeholder="New ensemble"
          @blur="explorerStore.renameItems(ensemble)"
          @keydown.enter="explorerStore.renameItems(ensemble)"
          :value="explorerStore.editName"
          @input="explorerStore.editName = ($event.target as HTMLInputElement).value"
        />
        <span v-else class="font-bold">{{ ensemble?.titre }}</span>
      </div>
      <div class="flex gap-1">
        <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" 
          @click.stop="explorerStore.deleteItems(ensemble)" />

        <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" 
          @click.stop="explorerStore.openRename(ensemble)" />
      </div>
    </div>
  </li>
</template>

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

<script setup lang="ts">
  import { useExplorerStore } from "../stores";
  import { EnsembleModel } from "../db/dbModels";
  import draggable from 'vuedraggable'

  import { SquareX, PenLine,ChevronRight } from 'lucide-vue-next';
  const explorerStore = useExplorerStore()
  defineProps({
    ensemble: EnsembleModel
  })
</script>