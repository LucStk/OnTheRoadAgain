<template>
  <div id="conteneur_road.etapes" class="flex flex-col h-full overflow-y-hidden"> 
    <!-- road.etapes -->
    <ul class="flex items-center overflow-x-auto overflow-y-hidden" style="width: 800px;">
      <li
        v-for="(event, index) in road.etapes"
        :key="index"
        class="flex flex-row items-center cursor-pointer"
        :style="{ width: `${(event.proportion / 100) * totalWidth}px` }"
      >
        <div class="flex items-center justify-start my-2">
          <!-- Point cliquable -->
          <div
            class="flex size-4.5 items-center justify-center rounded-full"
            :class="[
              IndexStore.index === index
                ? 'bg-blue-500'
                : 'bg-primary/20'
            ]"
            @click="IndexStore.change_index(index)"
          >
            <span class="badge badge-primary size-3 rounded-full p-0"></span>
          </div>
        </div>
                  <!-- Ligne entre les points -->
          <div
            v-if="index < road.etapes.length - 1"
            class="h-0.5 bg-black flex-grow mx-1"
          ></div>
      </li>
    </ul>

    <!-- Description & photo -->
    <div id="taginfo" class="ml-8 p-4 border rounded w-96 overflow-y-hidden" v-if="IndexStore.index !== null">
      <h3 class="text-xl font-semibold">
        {{ road.etapes[IndexStore.index].label }} ({{ road.etapes[IndexStore.index].year }})
      </h3>
      <p class="mt-2 text-gray-700">
        {{ road.etapes[IndexStore.index].description }}
      </p>
      <img
        v-if="road.etapes[IndexStore.index].photo"
        :src="road.etapes[IndexStore.index].photo"
        :alt="road.etapes[IndexStore.index].label"
        class="mt-4 max-w-full h-auto rounded"
      />
    </div>
  </div>
</template>


<script setup>
    import { ref,inject } from 'vue'
    import { useIndexStore } from '@/stores/global'

    const totalWidth = 800
    const road = inject('road')
    const IndexStore = useIndexStore()
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
