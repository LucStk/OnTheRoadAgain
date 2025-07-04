// models/BaseModelMixin.ts
import { getLastSyncTime } from '../syncMetaDB';
import { type Table } from 'dexie';
import type { BaseModelShape } from '../dbTypes/withBase.Model';

export function withBaseModel<TBase extends new (...args: any[]) => { 
  id: string; 
  created_at: string; 
  updated_at: string; 
  dirty: number; 
  is_deleted: number }>(
  Base: TBase,
  table :Table<any, string>
) {
  return class extends Base {
    async update(data: Partial<this>) {
      const now = new Date().toISOString();
      Object.assign(this, data, { updated_at: now, dirty: 1 });

      if (!this.id) throw new Error('Cannot update object without an ID');
      await table.update(this.id, { ...data, updated_at: now, dirty: 1 });
    }

    async save(): Promise<void> {
      await table.put(this);
    }

    async delete(): Promise<void> {
      const lastSync = await getLastSyncTime();
      if (new Date(lastSync) < new Date(this.created_at)) {
        await table.delete(this.id);
      } else {
        await table.update(this.id, { is_deleted: 1 });
      }
    }

    static enrich<T>(data: Partial<T>): Partial<T> {
      const now = new Date().toISOString();
      return {
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
        dirty: 1,
        is_deleted: 0,
        ...data}
    }
    static async create<T>(data: Partial<T>): Promise<BaseModelShape> {
      throw new Error("Create method not implemented")
      const instance = new this(this.enrich(data));
      await (instance as any).save();
    }
  };
}
