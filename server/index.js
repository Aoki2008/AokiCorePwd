const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Projects API ---

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { accounts: true }
                }
            }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Create a project
app.post('/api/projects', async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const project = await prisma.project.create({
            data: { name, description },
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Unlink accounts in trash (set projectId to null)
        await prisma.account.updateMany({
            where: {
                projectId: Number(id),
                deletedAt: { not: null }
            },
            data: { projectId: null }
        });

        // 2. Delete active accounts (or move to trash if desired, but current logic was hard delete)
        // We stick to hard deleting active accounts as per original logic, but now trash items are safe.
        await prisma.account.deleteMany({
            where: {
                projectId: Number(id),
                deletedAt: null
            }
        });

        // 3. Delete the project
        await prisma.project.delete({ where: { id: Number(id) } });
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// --- Accounts API ---

// Get accounts for a project
app.get('/api/projects/:id/accounts', async (req, res) => {
    const { id } = req.params;
    try {
        const accounts = await prisma.account.findMany({
            where: {
                projectId: Number(id),
                deletedAt: null
            },
            orderBy: { createdAt: 'desc' },
        });
        // Parse the JSON string data back to object
        const parsedAccounts = accounts.map(acc => ({
            ...acc,
            data: JSON.parse(acc.data)
        }));
        res.json(parsedAccounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

// Create an account
app.post('/api/accounts', async (req, res) => {
    const { projectId, name, data } = req.body;
    if (!projectId || !name) return res.status(400).json({ error: 'Project ID and Name are required' });

    try {
        const account = await prisma.account.create({
            data: {
                projectId: Number(projectId),
                name,
                data: JSON.stringify(data || {}), // Store custom fields as JSON string
            },
        });
        res.json({ ...account, data: JSON.parse(account.data) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Update an account
app.put('/api/accounts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, data } = req.body;

    try {
        const account = await prisma.account.update({
            where: { id: Number(id) },
            data: {
                name,
                data: JSON.stringify(data || {}),
            },
        });
        res.json({ ...account, data: JSON.parse(account.data) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update account' });
    }
});

// Soft delete an account
app.delete('/api/accounts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.account.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() }
        });
        res.json({ message: 'Account moved to trash' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// --- Recycle Bin API ---

// Get deleted accounts (Trash)
app.get('/api/trash', async (req, res) => {
    try {
        const accounts = await prisma.account.findMany({
            where: { deletedAt: { not: null } },
            orderBy: { deletedAt: 'desc' },
            include: { project: true } // Include project info if needed
        });

        const parsedAccounts = accounts.map(acc => ({
            ...acc,
            data: JSON.parse(acc.data)
        }));
        res.json(parsedAccounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trash' });
    }
});

// Restore an account
app.post('/api/accounts/:id/restore', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.account.update({
            where: { id: Number(id) },
            data: { deletedAt: null }
        });
        res.json({ message: 'Account restored' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to restore account' });
    }
});

// Permanently delete an account
app.delete('/api/trash/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.account.delete({ where: { id: Number(id) } });
        res.json({ message: 'Account permanently deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account permanently' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
