import Dexie, { type EntityTable } from 'dexie';

interface Ensemble {
  id: string;

  titre: string;
  description: string;
  visibility: 'C' | 'O';
  
  created_at: string;
  updated_at: string;

  dirty: number;
  deleted: number;
}

const db = new Dexie('EnsembleDB') as Dexie & {
  ensemble: EntityTable<
    Ensemble,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  ensemble: 'id, titre, description, visibility, updated_at, created_at, dirty, deleted' // primary key "id" (for the runtime!)
});

db.open().catch((err) => {
  console.error("Erreur lors de l'ouverture de Dexie:", err)
})


// Auto-set timestamps on creation
db.ensemble.hook('creating', (primKey, obj) => {
  const now = new Date().toISOString();
  obj.created_at = now;
  obj.updated_at = now;
  obj.dirty = 1;
});


export type { Ensemble };
export { db };