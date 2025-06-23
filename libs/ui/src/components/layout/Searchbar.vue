<template>
  <div class="relative flex items-center me-auto ms-auto">
    <input
      v-model="query"
      type="text"
      placeholder="Rechercher..."
      @input="fetchPlaceSuggestions"
      class="input input-bordered w-full max-w-xs"
    />
    <ul v-if="suggestions.length" class="absolute bg-white border border-gray-300 mt-2 w-full max-w-xs shadow-lg z-10">
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        class="p-2 cursor-pointer hover:bg-gray-100"
      >
        {{ suggestion.description }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const query = ref('');
type Suggestion = {
  description: string;
}
const suggestions = ref<Suggestion[]>([]);


// Fetch place suggestions from the proxy
const fetchPlaceSuggestions = async () => {
  if (!query.value) {
    suggestions.value = [];
    return;
  }

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/autocomplete', {  // Adjust the URL if your proxy is hosted elsewhere
      params: {
        input: query.value,
      },
    });

    suggestions.value = response.data.predictions;
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions de lieu:', error);
  }
};

const selectSuggestion = (suggestion : Suggestion) => {
  query.value = suggestion.description;
  suggestions.value = [];
  // Optionally, take further actions, like focusing the map on this location
};
</script>

<style scoped>
/* Add additional styles if needed */
</style>