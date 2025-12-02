const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const remoteDataService = {
    getProjects: async () => {
        const res = await fetch(`${API_URL}/projects`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        return { data };
    },
    createProject: async (projectData) => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        if (!res.ok) throw new Error('Failed to create project');
        const data = await res.json();
        return { data };
    },
    deleteProject: async (id) => {
        const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete project');
        return { data: { message: 'Project deleted' } };
    },
    getAccounts: async (projectId) => {
        const res = await fetch(`${API_URL}/projects/${projectId}/accounts`);
        if (!res.ok) throw new Error('Failed to fetch accounts');
        const data = await res.json();
        return { data };
    },
    createAccount: async (accountData) => {
        const res = await fetch(`${API_URL}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accountData)
        });
        if (!res.ok) throw new Error('Failed to create account');
        const data = await res.json();
        return { data };
    },
    updateAccount: async (id, accountData) => {
        const res = await fetch(`${API_URL}/accounts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accountData)
        });
        if (!res.ok) throw new Error('Failed to update account');
        const data = await res.json();
        return { data };
    },
    deleteAccount: async (id) => {
        const res = await fetch(`${API_URL}/accounts/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete account');
        return { data: { message: 'Account moved to trash' } };
    },
    getTrash: async () => {
        const res = await fetch(`${API_URL}/trash`);
        if (!res.ok) throw new Error('Failed to fetch trash');
        const data = await res.json();
        return { data };
    },
    restoreAccount: async (id) => {
        const res = await fetch(`${API_URL}/accounts/${id}/restore`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to restore account');
        return { data: { message: 'Account restored' } };
    },
    deleteTrash: async (id) => {
        const res = await fetch(`${API_URL}/trash/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete account permanently');
        return { data: { message: 'Account permanently deleted' } };
    }
};

export default remoteDataService;
