// models/EnsembleModel.ts
import { EnsembleClass } from '../dbClasses';
import { db } from '../dbApp';
import { withBaseModel } from './BaseModelMixin';
import type { BaseModelShape } from '../dbTypes/withBase.Model';
import { FamilyTreeModel } from './FamilyTreeModel';

const _EnsembleModel = withBaseModel(EnsembleClass, db.ensembles);
export class EnsembleModel extends _EnsembleModel {

  static override async create(data: Partial<EnsembleClass>): Promise<BaseModelShape> {
    const defaults = {
      type: 'ensemble' as const,
      visibility: 'C' as const,
      is_global: 0,
    };
    const instance = new this(this.enrich({ ...defaults, ...data }));
    await (instance as any).save();
    return instance;
  }
}
