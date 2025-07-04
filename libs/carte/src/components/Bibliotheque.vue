<template>
  <div class="flex h-screen absolute z-50">
    <!-- Sidebar -->
    <TransitionRoot :show="true" as="template">
      <div class="w-64 bg-base-200 p-4 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Menu</h2>
          <button class="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        <ul class="flex flex-col ">
          <li v-for="e in visibleEnsembles" :key="e.id" 
            class="flex flex-col"
              @dragover.prevent
              @drop="onDrop(e)"
            >
            <!-- Ligne principale de l’ensemble -->
            <div
              class="flex flex-row items-center justify-between cursor-pointer"
              @click="toggleEnsemble(e.id)"
            >
              <div class="flex items-center gap-2 text-white hover:text-gray-300">
                <ChevronRight
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-90': openMap[e.id] }"
                />
                <input
                  v-if="focusId === e.id && renameOpen"
                  class="italic"
                  v-focus
                  placeholder="New ensemble"
                  @keydown.enter="renameItems(e)"
                  @blur="renameItems(e)"
                  v-model="editName"
                />
                <span v-else class="font-bold">{{ e.titre }}</span>
              </div>
              <div class="flex gap-2">
                <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" @click.stop="deleteItems(e)" />
                <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" @click.stop="openRename(e.id)" />
              </div>
            </div>

            <!-- Sous-menu des pins de l’ensemble -->
            <Transition name="fade" mode="out-in">
              <ul v-if="openMap[e.id]" class="ml-6 mt-2 space-y-1">
                <li
                  v-for="p in visiblePins.filter(p => p.ensemble_fk === e.id)"
                  :key="p.id"
                  class="flex flex-row items-center justify-between cursor-pointer"
                  draggable="true"
                  @dragstart="onDragStart(p)"
                >
                  <div class="flex items-center gap-2 text-white hover:text-gray-300">
                    <MapPin class="w-3.5 h-3.5" />
                    <span>{{ p.titre }}</span>
                  </div>
                  <div class="flex gap-1">
                    <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" @click.stop="deleteItems(p)" />
                    <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" @click.stop="openRename(p.id)" />
                  </div>
                </li>
              </ul>
            </Transition>
          </li>

        
        </ul>

        <Plus class=" w-4 h-4 mt-5 mx-auto cursor-pointer text-white hover:text-gray-700" @click="createEnsemble()" />
          <ul id="Items" class="flex flex-col ">
            <li v-for="p in visiblePins.filter(p => !p.ensemble_fk)"
              :key="p.id"
              class="flex flex-row items-end justify-between"
              draggable="true"
              @dragstart="onDragStart(p)">
            
           <div class="
            text-sm h-5 
            overflow-clip grow 
            flex flex-row 
            items-center
            text-white hover:text-gray-300
            cursor-pointer">
            <MapPin class="w-3.5 h-3.5 mr-2" />
            <input
              v-if ="focusId === p.id && renameOpen"
              class="italic"
              v-focus
              placeholder="New ensemble"
              @keydown.enter="renameItems(p)"
              @blur="renameItems(p)"
              v-model="editName"
            />
                <span v-else class="font-bold" >{{ p.titre }}</span>
            </div>
            <div class="text-sm flex flex-row items-center cursor-pointer">
              <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" @click="deleteItems(p)" />
              <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" @click="openRename(p.id)" />
            </div>

            </li>
          </ul>
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
    import { ref, type Ref, type Directive, computed } from 'vue'
    import { SquareX, PenLine, Plus, ChevronRight,MapPin } from 'lucide-vue-next';
    import { TransitionRoot } from '@headlessui/vue'
    import { useDBStore } from "../stores/storesDB";
    import {EnsembleClass, BaseModel } from "../db/appDB";

    const syncStore = useDBStore()
    const visibleEnsembles = computed(() => syncStore.ensembleList.value.filter(e => !e.is_deleted))
    const visiblePins = computed(() => syncStore.pinList.value.filter(e => !e.is_deleted))
    console.log("VisiblePins", visiblePins.value)

    const editName = ref("Paris-Brest")
    const renameOpen = ref(false)
    const focusId = ref<string>("")
    // directives

    const openMap = ref<Record<string, boolean>>({})

    function toggleEnsemble(id: string) {
      openMap.value[id] = !openMap.value[id]
    }

    function openRename(id: string) {
      renameOpen.value = true
      focusId.value = id
      editName.value = syncStore.ensembles[id].titre
    }

    async function renameItems(e : Partial<BaseModel>) {
      renameOpen.value = false
      if (e.update) {await e.update({ titre: editName.value })}
      editName.value = "Paris-Brest"
    }
    async function deleteItems(e : Partial<BaseModel>) {
      renameOpen.value = false
      if (e.delete) {e.delete()}
    }
    async function createEnsemble() {
      const newEns = await EnsembleClass.create({ type: 'ensemble' })
      focusId.value = newEns.id
      renameOpen.value = true
    }

    const draggedPin = ref<null | { id: string }>()

    function onDragStart(pin: { id: string }) {
      draggedPin.value = pin
    }

    async function onDrop(ensemble: { id: string }) {
      if (!draggedPin.value) return
      const pin = syncStore.pins[draggedPin.value.id]
      if (pin && pin.update) {
        await pin.update({ ensemble_fk: ensemble.id })
        console.log('pin updated')
      }
      draggedPin.value = null
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
