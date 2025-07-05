// models/FamilyTreeModel.ts
import { FamilyTreeClass} from '../dbClasses';
import { db } from '../dbApp';

export class FamilyTreeModel extends FamilyTreeClass{
    
  static async addChildtoParent(
    child_id: string,
    parent_id?: string,
    order?: number
    ) {
    const id = crypto.randomUUID()
    await db.familyTrees.put({ id, child_id: child_id, parent_id: parent_id, order })
  }

  static async isItemInEnsemble(itemId: string) : Promise<boolean> {
    const rel = await db.familyTrees
        .where({ item_id: itemId})
        .first()
    return rel !== undefined
  }

  static async removeChildFromParent(childId: string, parentID: string) {
    const rel = await db.familyTrees
        .where({ child_id: childId, parent_id: parentID })
        .first()
    if (rel) await db.familyTrees.delete(rel.id)
  }

  static async getItemsInEnsemble(parentID: string) {
    const FamilyTreeList = await db.familyTrees.toArray()
    return FamilyTreeList
      .filter(rel => rel.parent_id === parentID)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }
}
