import Dexie, { type EntityTable } from 'dexie';

interface Ensemble {
  id: string;

  titre: string;
  description: string;
  visibility: string;
  
  created_at: string;
  updated_at: string;
}

const db = new Dexie('EnsembleDB') as Dexie & {
  ensemble: EntityTable<
    Ensemble,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  ensemble: 'id, titre, description, visibility, updated_at, created_at' // primary key "id" (for the runtime!)
});

export type { Ensemble };
export { db };