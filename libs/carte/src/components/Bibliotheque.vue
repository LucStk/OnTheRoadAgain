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
            class="
            flex flex-row 
            items-end justify-between
            "
           >
           <div class="
            text-sm h-5 
            overflow-clip grow 
            flex flex-row 
            text-white hover:text-gray-300
            cursor-pointer">
            <ChevronRight class="w-5 h-5" />
            <input
              v-if ="focusId === e.id && renameOpen"
              class="italic"
              v-focus
              placeholder="New ensemble"
              @keydown.enter="renameEnsemble(e)"
              @blur="renameEnsemble(e)"
              v-model="editName"
            />
                <span v-else class="font-bold" >{{ e.titre }}</span>
            </div>
            <div class="text-sm flex flex-row items-center cursor-pointer">
              <SquareX class="w-3.5 h-3.5 text-red-500 hover:text-red-700" @click="deleteEnsemble(e)" />
              <PenLine class="w-3.5 h-3.5 text-white hover:text-green-700" @click="openRenameEnsemble(e.id)" />
            </div>
            <ul id="Items">
              
            </ul>

          </li>
        
        </ul>

        <Plus class=" w-4 h-4 mt-5 mx-auto cursor-pointer text-white hover:text-gray-700" @click="createEnsemble()" />

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
    import { SquareX, PenLine, Plus, ChevronRight } from 'lucide-vue-next';
    import { TransitionRoot } from '@headlessui/vue'
    import { useDBStore } from "../stores/storesDB";
    import {EnsembleClass } from "../db/appDB";

    const syncStore = useDBStore()
    const visibleEnsembles = computed(() => syncStore.ensembleList.value.filter(e => !e.is_deleted))
    const visiblePins = computed(() => syncStore.pinList.value.filter(e => !e.is_deleted))

    const editName = ref("Paris-Brest")
    const renameOpen = ref(false)
    const focusId = ref<string>("")
    // directives

    function openRenameEnsemble(id: string) {
      renameOpen.value = true
      focusId.value = id
      editName.value = syncStore.ensembles[id].titre
    }

    async function renameEnsemble(e : EnsembleClass) {
      renameOpen.value = false
      await e.update({ titre: editName.value })
      editName.value = "Paris-Brest"
    }
    async function deleteEnsemble(e : EnsembleClass) {
      renameOpen.value = false
      e.delete()
    }
    async function createEnsemble() {
      const newEns = await EnsembleClass.create({ type: 'ensemble' })
      focusId.value = newEns.id
      renameOpen.value = true
    }

</script>
