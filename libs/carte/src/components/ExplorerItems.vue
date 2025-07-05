<template>
  <li class="flex flex-col">
    <div class="flex flex-row items-center justify-between cursor-pointer">
      <div class="flex items-center gap-2 text-white hover:text-gray-300">
        <ChevronRight v-if="element.type === 'ensemble'" class="w-4 h-4 transition-transform duration-200"/>
        <Pin v-else class="w-4 h-4 transition-transform duration-200"/>
        <input
          v-if="explorerStore.focusId === element?.id && explorerStore.renameOpen"
          class="italic"
          v-focus
          placeholder="New ensemble"
          @blur="explorerStore.renameItems(element)"
          @keydown.enter="explorerStore.renameItems(element)"
          :value="explorerStore.editName"
          @input="explorerStore.editName = ($event.target as HTMLInputElement).value"
        />
        <span v-else class="font-bold">{{ element?.titre }}</span>
      </div>
      <div class="flex gap-1">
        <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" 
          @click.stop="explorerStore.deleteItems(element)" />

        <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" 
          @click.stop="explorerStore.openRename(element)" />
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
  import type { BaseModelInstance } from "../db/dbTypes/withBase.Model";
  import { SquareX, PenLine, ChevronRight, Pin } from 'lucide-vue-next';
  import { useExplorerStore } from "../stores/storesExplorer";
  const explorerStore = useExplorerStore()

  const props = defineProps<{
    element: BaseModelInstance
  }>()
</script>