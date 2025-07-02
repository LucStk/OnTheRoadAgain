<template>
  <div class="relative w-full max-w-xs mx-auto">
    <Combobox v-model="selectedSuggestion" @update:modelValue="onSelect">
      <div class="relative">
        <div class="relative w-full">
          <ComboboxInput
            class="input input-bordered w-full"
            placeholder="Rechercher un lieu..."
            :displayValue="(item: unknown) => displayValue(item as PhotonFeature | null)"
            @input="onInput"
          />
        </div>

        <ComboboxOptions
          v-if="suggestions.length"
          class="absolute 
          z-10 mt-1 max-h-60 w-full 
          text-black
          overflow-auto rounded-md bg-white 
          py-1 text-base shadow-lg 
          border border-gray-300"
        >
          <ComboboxOption
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :value="suggestion"
            class="cursor-pointer select-none px-4 py-2 hover:bg-gray-100"
          >
            {{ suggestion.properties.name }}, {{ suggestion.properties.country }}
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/vue'
import { useMapStore } from '../stores/map_stores'
import { Pin } from '../elements/pin'

interface PhotonFeature {
  type: string
  geometry: {
    type: string
    coordinates: [number, number]
  }
  properties: {
    name: string
    country: string
    [key: string]: any
  }
}

const mapstore = useMapStore()
const query = ref('')
const suggestions = ref<PhotonFeature[]>([])
const selectedSuggestion = ref<PhotonFeature | null>(null)

const displayValue = (item: PhotonFeature | null) => {
  if (!item) return query.value
  return item.properties?.name || query.value
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  query.value = target.value
}

watchDebounced(
  query,
  async (newQuery) => {
    if (!newQuery) {
      suggestions.value = []
      return
    }

    try {
      const map = mapstore.getMap()
      let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(newQuery)}&limit=5&lang=fr`
      
      if (map) {
        const center = map.getCenter()
        url += `&lat=${center.lat}&lon=${center.lng}`
      }

      const res = await fetch(url)
      const data = await res.json()
      suggestions.value = data.features
    } catch (error) {
      console.error('Erreur lors de la recherche avec Photon:', error)
    }
  },
  { debounce: 100, maxWait: 1000 }
)

const onSelect = (feature: PhotonFeature | null) => {
  if (!feature) return

  query.value = feature.properties.name
  suggestions.value = []
  const map = mapstore.getMap()
  if (map && feature.geometry?.coordinates) {
    const [lng, lat] = feature.geometry.coordinates
    const pin = new Pin(feature.geometry.coordinates)
    map.flyTo({
      center: [lng, lat],
      zoom: 14,
      essential: true,
    })
  }
}
</script>
