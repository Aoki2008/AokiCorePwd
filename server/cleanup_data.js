const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    try {
        console.log('Starting data cleanup...');

        // 1. Find the "Google" project
        const googleProject = await prisma.project.findFirst({
            where: {
                name: {
                    contains: 'Google', // Case-insensitive check might depend on DB collation, but usually 'contains' is safer
                }
            }
        });

        let googleProjectId = null;

        if (googleProject) {
            console.log(`Found Google Project: ${googleProject.name} (ID: ${googleProject.id})`);
            googleProjectId = googleProject.id;
        } else {
            console.log('WARNING: "Google" project not found. All data will be deleted.');
        }

        // 2. Delete all accounts in Trash (deletedAt is not null)
        const deletedTrash = await prisma.account.deleteMany({
            where: {
                deletedAt: { not: null }
            }
        });
        console.log(`Deleted ${deletedTrash.count} accounts from Recycle Bin.`);

        // 3. Delete accounts NOT belonging to Google Project
        // If googleProjectId is null, this deletes ALL accounts (except those already deleted in step 2 if they were active? No, step 2 deleted trash)
        // We want to keep active accounts ONLY if they belong to Google Project.
        const deletedAccounts = await prisma.account.deleteMany({
            where: {
                OR: [
                    { projectId: { not: googleProjectId } }, // Not Google Project
                    { projectId: null } // Orphaned accounts (if any)
                ],
                deletedAt: null // Only active ones (trash already gone)
            }
        });
        console.log(`Deleted ${deletedAccounts.count} other accounts.`);

        // 4. Delete all projects EXCEPT Google Project
        const deletedProjects = await prisma.project.deleteMany({
            where: {
                id: { not: googleProjectId }
            }
        });
        console.log(`Deleted ${deletedProjects.count} other projects.`);

        console.log('Cleanup complete.');

    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
