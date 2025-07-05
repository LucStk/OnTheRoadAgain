<template>
  <div class="flex h-screen absolute z-50">
    <!-- Sidebar -->
    <TransitionRoot :show="true" as="template">
      <div class="w-64 bg-base-200 p-4 overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Menu</h2>
          <button class="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        <draggable class="flex flex-col"
          :list="rootEnsembles"
          group="ensembles"
          item-key="id"
          @end="onDrop"
          @change="onMove"
          >
          <template #item="{ element, index }">
            <ExplorerItem
              :ensemble="element"
              :index="index"
            />
          </template>
        </draggable>
        <Plus class="
            w-4 h-4 mt-5 
            mx-auto cursor-pointer 
            text-white 
            hover:text-gray-700" 
            @click="explorerStore.createEnsemble()"
            />

        <Route class=" w-4 h-4 mt-5 
          mx-auto cursor-pointer 
          text-white 
          hover:text-gray-700" />
      </div>
    </TransitionRoot>
  </div>
</template>

<script lang="ts">
  // auto-focus + auto-select
  const vFocus: Directive = {
    mounted(el: HTMLInputElement) {
      el.focus()
    },
    updated(el: HTMLInputElement) {
      el.focus()
    }
  }
  export default {
    directives: {
      focus: vFocus
    }
  }

</script>

<script setup lang="ts">
  import { type Directive, computed } from 'vue'
  import { Plus, Route } from 'lucide-vue-next';
  import { TransitionRoot } from '@headlessui/vue'
  
  import ExplorerItem from './ExplorerItems.vue'

  import { useDBStore } from "../db/dbStores";
  import { useExplorerStore } from "../stores/storesExplorer";
  import { FamilyTreeModel } from "../db/dbModels";
  import draggable from 'vuedraggable'

  const explorerStore = useExplorerStore()
  const dbStore = useDBStore()

  // Est ensemble visible si il n'est pas supprimé et si il n'est pas lui même dans un item
  const rootEnsembles = computed(() => {
    const noParent = dbStore.familyTreeList.value.filter(e => e.parent_id === undefined)
    return dbStore.ensembleList.value.filter(e => !e.is_deleted && FamilyTreeModel.isItemInEnsemble(e.id))
  })
  const visibleItems = computed(() => dbStore.itemsList.value.filter(e => !e.is_deleted))

  console.log("visibleEnsembles", rootEnsembles.value)
  function onDrop(e: any) {
    console.log("onDrop", e)
  }
  function onMove(e: any) {
    console.log("onMove", e)
  }
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
