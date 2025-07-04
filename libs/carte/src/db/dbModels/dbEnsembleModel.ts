// models/EnsembleModel.ts
import { EnsembleClass } from '../dbClasses';
import { db } from '../dbApp';
import { withBaseModel } from './dbBaseModelMixin';

const _EnsembleModel = withBaseModel(EnsembleClass, db.ensembles);
export class EnsembleModel extends _EnsembleModel {
  static override async create(data: Partial<EnsembleClass>) {
    const defaults = {
      type: 'ensemble' as const,
      visibility: 'C' as const,
      is_global: 0,
    };
    const instance = new this(this.enrich({ ...defaults, ...data }));
    await (instance as any).save();
  }
}
