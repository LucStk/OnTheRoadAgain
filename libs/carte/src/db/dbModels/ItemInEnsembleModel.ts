// models/ItemInEnsembleModel.ts
import { ItemInEnsembleClass} from '../dbClasses';
import { db } from '../dbApp';

export class ItemInEnsembleModel extends ItemInEnsembleClass{
    
  static async addItemToEnsemble(
    itemId: string,
    ensembleId: string,
    itemType: 'pin' | 'route' | 'ensemble',
    order?: number
    ) {
    const id = crypto.randomUUID()
    await db.itemInEnsembles.put({ id, ensemble_id: ensembleId, item_id: itemId, item_type: itemType, order })
  }

  static async removeItemFromEnsemble(itemId: string, ensembleId: string) {
    const rel = await db.itemInEnsembles
        .where({ item_id: itemId, ensemble_id: ensembleId })
        .first()
    if (rel) await db.itemInEnsembles.delete(rel.id)
  }

  static async getItemsInEnsemble(ensembleId: string) {
    const itemInEnsembleList = await db.itemInEnsembles.toArray()
    return itemInEnsembleList
      .filter(rel => rel.ensemble_id === ensembleId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }
}
