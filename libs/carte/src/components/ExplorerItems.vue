// ExplorerItems.vue
<template>
<draggable
  v-if="localElements.length"
  class="pl-4"
  :list="localElements"
  group="ensembles"
  item-key="id"
  @end="onDrop"
  @change="onMove"
>
  <template #item="{ element }">
    <div
      v-if="element && element.id"
      :key="element.id"
      class="flex flex-row items-center justify-between cursor-pointer"
    >
      <div class="flex items-center gap-2 text-white hover:text-gray-300">
        <ChevronRight v-if="element.type === 'ensemble'" class="w-4 h-4" />
        <Pin v-else class="w-4 h-4" />
        <input
          v-if="explorerStore.focusId === element.id && explorerStore.renameOpen"
          class="italic"
          v-focus
          placeholder="New ensemble"
          @blur="explorerStore.renameItems(element)"
          @keydown.enter="explorerStore.renameItems(element)"
          :value="explorerStore.editName"
          @input="explorerStore.editName = ($event.target as HTMLInputElement).value"
        />
        <span v-else class="font-bold">{{ element.titre }}</span>
      </div>
      <div class="flex gap-1">
        <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" @click.stop="explorerStore.deleteItems(element)" />
        <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" @click.stop="explorerStore.openRename(element)" />
      </div>
    </div>
  </template>
</draggable>
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
import { computed } from 'vue'
import { useExplorerStore } from "../stores/storesExplorer";
import { useDBStore } from "../db/dbStores";
import { SquareX, PenLine, ChevronRight, Pin } from 'lucide-vue-next';
import type { BaseModelInstance } from "../db/dbTypes/withBase.Model";
import draggable from 'vuedraggable'
import { watch, ref } from 'vue'

const explorerStore = useExplorerStore()
const dbStore = useDBStore()

const props = defineProps<{
  elements: BaseModelInstance[]
}>()
const localElements = ref<BaseModelInstance[]>([])

// Sync initial + update si la prop change
watch(
  () => props.elements,
  (newVal) => {
    const safe = Array.isArray(newVal)
      ? newVal.filter(e => e && e.id != null)
      : []
    console.log("✅ Injecting into localElements:", safe)
    localElements.value = safe
  },
  { immediate: true }
)

// ✅ Liste des enfants de cet élément (type ensemble uniquement)
/*
const children = computed(() => {
  const links = dbStore.familyTreeList.value.filter(e => e.parent_id === props.element.id)
  return links
    .map(link => dbStore.get(link.child_id))
    .filter(e => e && e.is_deleted === 0)
})*/

function onDrop(evt: any) {
  console.log('Dropped into', evt)
  // ❗ Tu peux mettre à jour le parent_id ici :
  /*
  const movedItem = evt.item.__vue__.element
  const newParentId = props.element.id

  explorerStore.moveToParent(movedItem.id, newParentId)*/
}

function onMove(evt: any) {
  console.log('Moving within', evt)
}
</script>
