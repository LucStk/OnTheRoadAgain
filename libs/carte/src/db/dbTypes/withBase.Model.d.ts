import { Table } from 'dexie'
import { getLastSyncTime } from '../src/syncMetaDB' // adapte le chemin à ton projet

/**
 * Représente un constructeur de classe avec des propriétés de base requises pour l'enrichissement.
 */
export type Constructor<T = {}> = new (...args: any[]) => T

/**
 * Propriétés requises pour que la classe fonctionne avec le mixin
 */
export interface BaseModelShape {
  id: string
  created_at: string
  updated_at: string
  dirty: number
  is_deleted: number
}

/**
 * Interface des méthodes injectées dans l'instance
 */
export type BaseModelInstance = InstanceType<ReturnType<typeof withBaseModel<any>>>

export interface BaseModelInstanceMethods<T> {
  update(data: Partial<T>): Promise<void>
  save(): Promise<void>
  delete(): Promise<void>
}

/**
 * Interface des méthodes statiques injectées dans la classe
 */
export interface BaseModelStatic<T> {
  create(this: new (data: Partial<T>) => T, data: Partial<T>): Promise<T>
}

/**
 * Mixin de logique métier générique pour les modèles Dexie
 */
export declare function withBaseModel<TBase extends Constructor<BaseModelShape>>(
  Base: TBase,
  getTable: () => Table<any, string>
): TBase &
  Constructor<
    InstanceType<TBase> & BaseModelInstanceMethods<InstanceType<TBase>>
  > &
  BaseModelStatic<InstanceType<TBase>>
