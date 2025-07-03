<template>
  <div class="flex h-screen absolute z-50">
    <!-- Sidebar -->
    <TransitionRoot :show="true" as="template">
      <div class="w-64 bg-base-200 shadow-md p-4 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Menu</h2>
          <button class="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        <ul class="menu menu-vertical rounded-box ">
           <li v-for="e in items." :key="e.id"></li>
            <input
              v-if ="focusId === e.id && renameOpen"
              class="input input-sm input-bordered w-full"
              v-focus
              placeholder="New ensemble"
              @keydown.enter="renameEnsemble(e.id)"
              @blur="renameEnsemble(e.id)"
              v-model="editName"
            />
            <div v-else class="text-sm" @click="openRenameEnsemble(e.id)">{{ e.titre }}</div>
            <button class="btn btn-xs btn-error" @click="deleteEnsemble(e.id)">
              *
            </button>
          </li>
        
        </ul>
        <div class="btn btn-secondary btn-xs" 
          @click="createEnsemble()">
          Créer un ensemble local
        </div>
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
    import { ref, type Ref, type Directive } from 'vue'
    import { TransitionRoot } from '@headlessui/vue'
    import { useSyncStore } from '../stores/appDB_stores'

    const syncStore = useSyncStore()
    const items = syncStore.enrichedObjects

    const editName = ref("")
    const renameOpen = ref(false)
    const focusId = ref<string>("")
    // directives

    function openRenameEnsemble(id: string) {
      renameOpen.value = true
      focusId.value = id
    }

    async function renameEnsemble(id: string) {
      renameOpen.value = false
      syncStore.updateObject(id, { titre: editName.value })
    }
    async function deleteEnsemble(id: string) {
      renameOpen.value = false
      syncStore.deleteObject(id)
    }
    async function createEnsemble() {
      focusId.value = await syncStore.addObject({ type: 'ensemble' })
      renameOpen.value = true
    }

</script>
