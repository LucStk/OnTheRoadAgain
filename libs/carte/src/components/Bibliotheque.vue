<template>
  <div class="flex h-screen absolute z-50">
    <!-- Sidebar -->
    <TransitionRoot :show="isOpen" as="template">
      <div class="w-64 bg-base-200 shadow-md p-4 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Menu</h2>
          <button @click="isOpen = false" class="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>
        


        <ul class="menu menu-vertical rounded-box ">
           <li v-for="e in ensembleStore.ensembles" :key="e.id">
            <a @click="onSelect(0)" class="btn btn-sm btn-ghost">
                {{ e.titre }}
            </a>
          </li>
        </ul>

        <h2 class="text-lg font-semibold">Exemple</h2>

        <ul class="menu menu-vertical rounded-box">
          <li>
            <details open>
              <summary>Catégorie 1</summary>
              <ul>
                <li><a @click="onSelect(1)">Item 1</a></li>
                <li>            <details>
              <summary>Catégorie 2</summary>
              <ul>
                <li><a @click="onSelect(3)">Item 3</a></li>
                <li><a @click="onSelect(4)">Item 4</a></li>
              </ul>
            </details></li>
              </ul>
            </details>
          </li>

          <li>
            <details>
              <summary>Catégorie 2</summary>
              <ul>
                <li><a @click="onSelect(3)">Item 3</a></li>
                <li><a @click="onSelect(4)">Item 4</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </TransitionRoot>

    <!-- Toggle button -->
    <div class="p-2">
      <button v-if="!isOpen" @click="isOpen = true" class="btn btn-sm btn-primary">
        ☰
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { ref, type Ref } from 'vue'
    import { TransitionRoot } from '@headlessui/vue'
    import { useAuthStore,api } from '@repo/auth'
    import type { PinDataLike } from '../types/pin-types'
    import { useEnsembleStore } from '@/stores/ensembleStores'

    const ensembleStore = useEnsembleStore()

    const isOpen = ref(true)
    const pins : Ref<PinDataLike[]> = ref([])

    const onSelect = (item: number) => {
        console.log('Selected:', item)
    }

</script>
