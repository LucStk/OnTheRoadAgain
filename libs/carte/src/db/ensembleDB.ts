import Dexie, { type Table } from 'dexie'

export interface EnsembleElement {
    id : string;
    user : string;
    ensemble : string;

    created_at : string;
    updated_at : string;

    dirty : number;
    deleted : number;
}

export interface Pin extends EnsembleElement {
    lnglat : string;
    titre : string;
    description : string;
}

export interface Ensemble {
  id: string;

  titre: string;
  description: string;
  visibility: 'C' | 'O';
  
  created_at: string;
  updated_at: string;

  dirty: number;
  deleted: number;
}

// Classe Dexie
class AppDB extends Dexie {
  ensemble!: Table<Ensemble, string>
  pin!: Table<Pin, number>

  constructor() {
    super('AppDB')
    this.version(1).stores({
      ensemble: 'id, updated_at, dirty, deleted',
      pin: 'id, ensemble, updated_at, dirty, deleted'
    })
  }
}

export const db = new AppDB()

db.open().catch((err) => {
  console.error("Erreur lors de l'ouverture de Dexie:", err)
})