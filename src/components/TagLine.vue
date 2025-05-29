<template>
  <ul class="flex items-center overflow-x-auto" style="width: 800px;">
    <template v-for="(event, index) in timeline" :key="index">
      
      <!-- Point timeline -->
      <li class="flex flex-col items-left" :style="{ width: `${(event.proportion / 100) * totalWidth}px` }">
        
        <!--date au dessus de l'élément
        <div class="timeline-start timeline-box w-24 text-base-content font-medium text-center">
          {{ event.year }}
        </div>-->
        
        <!--point-->
            <div class="flex items-center justify-center my-2">
            <span class="bg-primary/20 flex size-4.5 items-center justify-center rounded-full">
                <span class="badge badge-primary size-3 rounded-full p-0"></span>
            </span>
            <div
                v-if="index < timeline.length - 1"
                class="h-0.5 bg-black flex-grow mx-1"
            ></div>
            </div>

      </li>

      <!-- Ligne entre les points, sauf après le dernier -->
      

    </template>
  </ul>
</template>

<script setup>
const totalWidth = 800

const timeline = [
  { year: 1984, label: 'Macintosh PC', proportion: 10 },
  { year: 1998, label: 'iMac', proportion: 15 },
  { year: 2001, label: 'iPod', proportion: 15 },
  { year: 2007, label: 'iPhone', proportion: 25 },
  { year: 2015, label: 'Apple Watch', proportion: 20 },
  { year: 2024, label: 'Vision Pro', proportion: 15 },
]
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
