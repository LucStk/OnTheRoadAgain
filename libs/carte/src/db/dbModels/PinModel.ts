// models/PinModel.ts
import { PinClass } from '../dbClasses';
import { db } from '../dbApp';
import { withBaseModel } from './BaseModelMixin';
import type { BaseModelShape } from '../dbTypes/withBase.Model';
import { FamilyTreeModel } from './FamilyTreeModel';

const _PinModel = withBaseModel(PinClass, db.pins);
export class PinModel extends _PinModel {
  static override async create(data: Partial<PinClass>): Promise<BaseModelShape> {
    const defaults = {
      type: 'pin' as const,
      lnglat: '0,0',
      titre: 'New pin',
      ...data,
    }    
    const instance = new this(this.enrich({ ...defaults, ...data }));
    await (instance as any).save();
    return instance;
  }
}

