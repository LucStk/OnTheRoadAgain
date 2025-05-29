<template>
  <div id="conteneur_tagline" class="flex flex-col h-full overflow-y-hidden"> 
    <!-- Timeline -->
    <ul class="flex items-center overflow-x-auto overflow-y-hidden" style="width: 800px;">
      <li
        v-for="(event, index) in timeline"
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
            v-if="index < timeline.length - 1"
            class="h-0.5 bg-black flex-grow mx-1"
          ></div>
      </li>
    </ul>

    <!-- Description & photo -->
    <div id="taginfo" class="ml-8 p-4 border rounded w-96 overflow-y-hidden" v-if="selectedIndex !== null">
      <h3 class="text-xl font-semibold">
        {{ timeline[selectedIndex].label }} ({{ timeline[selectedIndex].year }})
      </h3>
      <p class="mt-2 text-gray-700">
        {{ timeline[selectedIndex].description }}
      </p>
      <img
        v-if="timeline[selectedIndex].photo"
        :src="timeline[selectedIndex].photo"
        :alt="timeline[selectedIndex].label"
        class="mt-4 max-w-full h-auto rounded"
      />
    </div>
  </div>
</template>


<script setup>
    import { ref } from 'vue'

    const totalWidth = 800

    const timeline = [
    {
        year: 1984,
        label: 'Macintosh PC',
        proportion: 10,
        description: "Le premier Macintosh, révolutionnaire pour son interface graphique.",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Macintosh_Portable-IMG_7541.jpg/1515px-Macintosh_Portable-IMG_7541.jpg"
    },
    {
        year: 1998,
        label: 'iMac',
        proportion: 15,
        description: "L’iMac a marqué un tournant dans le design des ordinateurs personnels.",
        photo: "https://upload.wikimedia.org/wikipedia/commons/5/58/IMac_G4_sunflower7.png"
    },
    {
        year: 2001,
        label: 'iPod',
        proportion: 15,
        description: "L’iPod a révolutionné la musique nomade.",
        photo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/IPod_1G.png"
    },
    {
        year: 2007,
        label: 'iPhone',
        proportion: 25,
        description: "Lancement du smartphone moderne avec écran tactile capacitif.",
        photo: "https://upload.wikimedia.org/wikipedia/commons/7/70/IPhone_2G_PSD_Mockup.png"
    },
    {
        year: 2015,
        label: 'Apple Watch',
        proportion: 20,
        description: "Apple entre dans l’univers des montres connectées.",
        photo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Apple_Watch.png"
    },
    {
        year: 2024,
        label: 'Vision Pro',
        proportion: 15,
        description: "Le casque spatial d’Apple ouvre une nouvelle ère d’interface.",
        photo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Apple_Vision_Pro_Logo.svg"
    }
    ]

    const selectedIndex = ref(null)

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
