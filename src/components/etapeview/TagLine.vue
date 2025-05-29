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
              selectedIndex === index
                ? 'bg-blue-500'
                : 'bg-primary/20'
            ]"
            @click="selectPoint(index)"
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
    <div id="taginfo" class="ml-8 p-4 border rounded w-96 overflow-y-hidden" v-if="selectedIndex !== null">
      <h3 class="text-xl font-semibold">
        {{ road.etapes[selectedIndex].label }} ({{ road.etapes[selectedIndex].year }})
      </h3>
      <p class="mt-2 text-gray-700">
        {{ road.etapes[selectedIndex].description }}
      </p>
      <img
        v-if="road.etapes[selectedIndex].photo"
        :src="road.etapes[selectedIndex].photo"
        :alt="road.etapes[selectedIndex].label"
        class="mt-4 max-w-full h-auto rounded"
      />
    </div>
  </div>
</template>


<script setup>
    import { ref,inject } from 'vue'

    const totalWidth = 800
    const road = inject('road')
    const selectedIndex = inject("nodeSelected")

    function selectPoint(index) {
      selectedIndex.value = index === selectedIndex.value ? null : index
    }

</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
