<template>
  <div class="flex h-screen absolute z-50">
    <!-- Sidebar -->
    <TransitionRoot :show="true" as="template">
      <div class="w-64 bg-base-200 p-4 overflow-y-auto"
        @dragover.prevent
        @drop="onDropOutside"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Menu</h2>
          <button class="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        <ul class="flex flex-col">
          <EnsembleItem
            v-for="e in visibleEnsembles"
            :key="e.id"
            :ensemble="e"
            :openMap="openMap"
            :focusId="focusId"
            :renameOpen="renameOpen"
            :editName="editName"
            @toggleEnsemble="toggleEnsemble"
            @deleteItems="deleteItems"
            @openRename="openRename"
            @renameItems="renameItems"
            @dragstart="onDragStart"
            @drop="onDrop"
            @clickPin="onClick"
            @update:editName="(val: string) => editName = val"
          />
        </ul>
        <Plus class=" w-4 h-4 mt-5 mx-auto cursor-pointer text-white hover:text-gray-700" @click="createEnsemble()" />
        <Route class=" w-4 h-4 mt-5 mx-auto cursor-pointer text-white hover:text-gray-700" @click="createRoute()" />
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
    import ItemsDropdown from './ItemsDropdown.vue';
    import { ref, type Ref, type Directive, computed } from 'vue'
    import { SquareX, PenLine, Plus, ChevronRight, MapPin, Route } from 'lucide-vue-next';
    import { TransitionRoot } from '@headlessui/vue'
    import { useDBStore } from "../db/dbStores";
    import { EnsembleModel, PinModel, RouteModel } from "../db/dbModels";
    import type { BaseModelInstanceMethods, BaseModelShape } from "../db/dbTypes/withBase.Model";
import type { BaseType } from '@/db/dbTypes/Classes';

    const syncStore = useDBStore()
    const visibleEnsembles = computed(() => syncStore.ensembleList.value.filter(e => !e.is_deleted))
    const visibleItems = computed(() => syncStore.itemsList.value.filter(e => !e.is_deleted))

    const editName = ref("Paris-Brest")
    const renameOpen = ref(false)
    const focusId = ref<string>("")
    // directives

    const openMap = ref<Record<string, boolean>>({})

    const createRoute = () => {
      console.log("createRoute")
      const newRoute = RouteModel.create({})
    }

    function toggleEnsemble(id: string) {
      openMap.value[id] = !openMap.value[id]
    }

    function openRename(id: string) {
      renameOpen.value = true
      focusId.value = id
      editName.value = syncStore.ensembleDict[id].titre
    }

    function handleRename(id: string | null) {
      if (id === null) {
        renameOpen.value = false;
        focusId.value = '';
      } else {
        renameOpen.value = true;
        focusId.value = id;
      }
    }

    async function renameItems(e : Partial<BaseModelInstanceMethods<BaseType>>) {
      renameOpen.value = false
      if (e.update) {await e.update({ titre: editName.value })}
      editName.value = "Paris-Brest"
    }

    async function deleteItems(e : Partial<BaseModelInstanceMethods<BaseType>>) {
      renameOpen.value = false
      if (e.delete) {e.delete()}
    }

    async function createEnsemble() {
      const newEns = await EnsembleModel.create({ type: 'ensemble' })
      focusId.value = newEns.id
      renameOpen.value = true
    }

    const draggedItem = ref<null | PinModel | RouteModel>()

    async function onDropOutside() {
      if (!draggedItem.value) return;

      const item = draggedItem.value;
      if (item) {
        await item.update({ ensemble_fk: undefined });
        console.log('Pin détaché d\'un ensemble (ensemble_fk mis à null)');
      }
    draggedItem.value = null;
    }
    function onDragStart(item: PinModel | RouteModel) {
      draggedItem.value = item
      console.log("onDragStart", item)
    }

    async function onDrop(ensemble: { id: string }) {
      if (!draggedItem.value) return
      const item = draggedItem.value;
      if (item) {
        await item.update({ ensemble_fk:  ensemble.id  });
        console.log('Pin détaché d\'un ensemble (ensemble_fk mis à null)');
      }
      draggedItem.value = null;
    }

    function onClick(item: PinModel | RouteModel) {
      console.log("onClick", item)
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
