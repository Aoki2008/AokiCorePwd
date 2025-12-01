const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Get the test project
        const project = await prisma.project.findFirst({ where: { name: 'Test Project' } });
        if (!project) throw new Error('Test Project not found');

        // 2. Create an account
        const account = await prisma.account.create({
            data: {
                projectId: project.id,
                name: 'Recycle Bin Test Account',
                data: JSON.stringify({ note: 'To be deleted' }),
            },
        });
        console.log('Created account:', account.id);

        // 3. Soft delete the account
        await prisma.account.update({
            where: { id: account.id },
            data: { deletedAt: new Date() },
        });
        console.log('Soft deleted account');

        // 4. Verify it's in trash
        const trash = await prisma.account.findMany({ where: { deletedAt: { not: null } } });
        const foundInTrash = trash.find(a => a.id === account.id);
        if (!foundInTrash) throw new Error('Account not found in trash');
        console.log('Verified account is in trash');

        // 5. Restore the account
        await prisma.account.update({
            where: { id: account.id },
            data: { deletedAt: null },
        });
        console.log('Restored account');

        // 6. Verify it's back in project (not deleted)
        const restored = await prisma.account.findUnique({ where: { id: account.id } });
        if (restored.deletedAt) throw new Error('Account still has deletedAt set');
        console.log('Verified account is restored');

    } catch (e) {
        console.error('Verification failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
