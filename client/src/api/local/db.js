import Dexie from 'dexie';

export const db = new Dexie('AokiCorePwdDB');

db.version(1).stores({
    projects: '++id, name, createdAt', // Primary key and indexed props
    accounts: '++id, projectId, name, deletedAt, createdAt', // Primary key and indexed props
});
