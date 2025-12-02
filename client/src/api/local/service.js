import { db } from './db';

const localDataService = {
    // --- Projects ---
    getProjects: async () => {
        const projects = await db.projects.orderBy('createdAt').reverse().toArray();
        // Enrich with account count
        for (const project of projects) {
            project._count = {
                accounts: await db.accounts.where('projectId').equals(project.id).and(a => !a.deletedAt).count()
            };
        }
        return { data: projects }; // Return in Axios-like format { data: ... }
    },

    createProject: async (projectData) => {
        const id = await db.projects.add({
            ...projectData,
            createdAt: new Date()
        });
        const newProject = await db.projects.get(id);
        return { data: newProject };
    },

    deleteProject: async (id) => {
        const numId = Number(id);
        // 1. Unlink accounts in trash
        await db.accounts
            .where('projectId').equals(numId)
            .and(a => !!a.deletedAt)
            .modify({ projectId: null });

        // 2. Delete active accounts
        await db.accounts
            .where('projectId').equals(numId)
            .and(a => !a.deletedAt)
            .delete();

        // 3. Delete project
        await db.projects.delete(numId);
        return { data: { message: 'Project deleted' } };
    },

    // --- Accounts ---
    getAccounts: async (projectId) => {
        const accounts = await db.accounts
            .where('projectId').equals(Number(projectId))
            .and(a => !a.deletedAt)
            .reverse()
            .sortBy('createdAt');
        return { data: accounts };
    },

    createAccount: async (accountData) => {
        const id = await db.accounts.add({
            ...accountData,
            projectId: Number(accountData.projectId),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        });
        const newAccount = await db.accounts.get(id);
        return { data: newAccount };
    },

    updateAccount: async (id, accountData) => {
        await db.accounts.update(Number(id), {
            ...accountData,
            updatedAt: new Date()
        });
        const updated = await db.accounts.get(Number(id));
        return { data: updated };
    },

    deleteAccount: async (id) => { // Soft delete
        await db.accounts.update(Number(id), {
            deletedAt: new Date()
        });
        return { data: { message: 'Account moved to trash' } };
    },

    // --- Recycle Bin ---
    getTrash: async () => {
        const accounts = await db.accounts
            .filter(a => !!a.deletedAt)
            .reverse()
            .sortBy('deletedAt');

        // Enrich with project name
        for (const acc of accounts) {
            if (acc.projectId) {
                const project = await db.projects.get(acc.projectId);
                acc.project = project;
            }
        }
        return { data: accounts };
    },

    restoreAccount: async (id) => {
        await db.accounts.update(Number(id), {
            deletedAt: null
        });
        return { data: { message: 'Account restored' } };
    },

    deleteTrash: async (id) => { // Permanent delete
        await db.accounts.delete(Number(id));
        return { data: { message: 'Account permanently deleted' } };
    }
};

export default localDataService;
