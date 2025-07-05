// stores/storesMap.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useDBStore } from "../db/dbStores";
import type { BaseModelInstanceMethods, BaseModelShape } from "../db/dbTypes/withBase.Model";
import type { BaseType } from '@/db/dbTypes/db-items';
import { EnsembleModel, FamilyTreeModel } from "../db/dbModels";
import { createError, ERROR_CODES } from '../errors';
import { db } from '../db/dbApp';
const dbStore = useDBStore()

export const useExplorerStore = defineStore('explorerstore', () => {
	// List des ensembles avec dropdown ouvert / fermé
	const openMap = ref<Record<string, boolean>>({}) 
	// Récupère le nom de l'élément séléctionné pour le renommage
	const editName = ref("Paris-Brest")
	// Renomme l'élément séléctionné ouvert / fermé
	const renameOpen = ref(false)
	// FocusId est l'id de l'élément séléctionné pour le renommage
	const focusId = ref<string>("")

	function openRename(e : Partial<BaseType> | undefined) {
		// Ouvre le renommage de l'élément séléctionné
		if (!e) throw createError("L'élément séléctionné n'existe pas", ERROR_CODES.REACTIVE_CONTINUITY_ERROR,{e})
		if (!e.id) throw createError("L'élément séléctionné n'a pas d'id", ERROR_CODES.DB_CONTINUITY_ERROR,{e})
		renameOpen.value = true
		focusId.value = e.id
		editName.value = dbStore.ensembleDict[e.id].titre
	}

	async function renameItems(e : Partial<BaseModelInstanceMethods<BaseType>>) {
		// Renomme l'élément séléctionné après openRename
		renameOpen.value = false
		if (e.update) {await e.update({ titre: editName.value })}
		editName.value = "Paris-Brest"
	}

	async function deleteItems(e : Partial<BaseModelInstanceMethods<BaseType>> | undefined) {
		renameOpen.value = false
		if (!e) throw createError("L'élément séléctionné n'existe pas", ERROR_CODES.REACTIVE_CONTINUITY_ERROR,{e})
		if (e.delete) {e.delete()}
	}

	async function createEnsemble() {
		const newEns = await EnsembleModel.create({ type: 'ensemble' })
		focusId.value = newEns.id
		renameOpen.value = true
	}
	// Fonction pour ouvrir / fermer le dropdown d'un élément
	function toggleEnsemble(id: string) {
		openMap.value[id] = !openMap.value[id]
	}

	function moveToParent(childId: string, newParentId: string) {
		const tree = dbStore.familyTreeList.value.find(
			e => e.child_id === childId
		)
		if (tree) {
			tree.parent_id = newParentId
			db.familyTrees.put(tree) // update dans Dexie
		} else {
			// s'il n’y a pas encore de lien, on le crée
			FamilyTreeModel.addChildtoParent(childId, newParentId)
		}
	}


  return {
		editName,
		renameOpen,	
		focusId,
		openMap,
		moveToParent,
		toggleEnsemble,
		openRename,
		renameItems,
		deleteItems,
		createEnsemble
  };
});