<script setup lang="ts">
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import { useDBStore } from "../db/dbStores";
import { ItemInEnsembleClass } from '@/db/dbClasses';
import { ItemInEnsembleModel } from '@/db/dbModels';

const props = defineProps({
  ensembleId: String
})

// Récupère tous les items d’un ensemble, triés par ordre
const items = computed(() => {
  return useDBStore().itemInEnsembleList.value
    .filter(rel => rel.ensemble_id === props.ensembleId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(rel => {
      if (rel.item_type === 'pin') return useDBStore().pinDict[rel.item_id]
      if (rel.item_type === 'route') return useDBStore().routeDict[rel.item_id]
      if (rel.item_type === 'ensemble') return useDBStore().ensembleDict[rel.item_id]
    })
    .filter(Boolean)
})
// Handle drop : mettre à jour la relation item <-> ensemble
async function onMove(event: any) {
  // event est l’événement Drag & Drop de vuedraggable
  // event.item contient l’élément déplacé
  // event.to, event.from contiennent les containers
  // Ici on fait simple: on recalcule les ordres dans le nouvel ensemble
  const newItems = event.to.__draggable_context.element
  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i]
    // Trouver la relation itemInEnsemble
    const rel = useDBStore().itemInEnsembleList.value.find(r => r.item_id === item.id && r.ensemble_id === props.ensembleId)
    if (rel) {
      if (props.ensembleId) await ItemInEnsembleModel.addItemToEnsemble(item.id, props.ensembleId, item.type, i) // Met à jour l’ordre
    }
  }
}

// Drag & Drop entre ensembles : gérer déplacer un item d’un ensemble à un autre
async function onDrop(event : any) {
  const draggedItem = event.item._underlying_vm_
  const oldEnsembleId = event.from.dataset.ensembleId
  const newEnsembleId = event.to.dataset.ensembleId

  if (oldEnsembleId !== newEnsembleId) {
    await ItemInEnsembleModel.removeItemFromEnsemble(draggedItem.id, oldEnsembleId)
    await ItemInEnsembleModel.addItemToEnsemble(draggedItem.id, newEnsembleId, draggedItem.type)
  }
}
</script>

<template>
  <div class="ensemble-explorer">
    <h3 v-if = "ensembleId">{{ useDBStore().ensembleDict[ensembleId]?.titre || 'Ensemble' }}</h3>
    <draggable
      :list="items"
      group="items"
      :data-ensemble-id="ensembleId"
      item-key="id"
      @end="onDrop"
      @change="onMove"
    >
      <template #item="{element}">
        <div class="item" :class="element.type">
          <template v-if="element.type === 'ensemble'">
            <EnsembleExplorer :ensembleId="element.id" />
          </template>
          <template v-else>
            <div>{{ element.titre }} ({{ element.type }})</div>
          </template>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.ensemble-explorer {
  border: 1px solid #ccc;
  padding: 8px;
  margin-bottom: 10px;
}
.item {
  padding: 5px;
  border: 1px solid #ddd;
  margin-bottom: 4px;
  cursor: grab;
  background-color: white;
}
.item.ensemble {
  background-color: #eef;
  padding-left: 15px;
  border-left: 4px solid #88f;
}
</style>
