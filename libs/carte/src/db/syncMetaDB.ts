// db/syncMetaDB.ts
import Dexie, { type EntityTable } from 'dexie';

const syncDB = new Dexie('SyncMetaDB') as Dexie & {
  meta: Dexie.Table<{ key: string; value: string }, 'key'>
}

syncDB.version(1).stores({
  meta: 'key'
})

export async function getLastSyncTime(): Promise<string> {
  const record = await syncDB.table('meta').get('last_sync')
  return record?.value || '1970-01-01T00:00:00Z'
}

export async function setLastSyncTime(date: string) {
  await syncDB.table('meta').put({ key: 'last_sync', value: date })
}
