const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const project = await prisma.project.findFirst({ where: { name: 'Test Project' } });
        if (!project) throw new Error('Test Project not found');

        await prisma.account.create({
            data: {
                projectId: project.id,
                name: 'Deleted Account for UI',
                data: JSON.stringify({ note: 'Visible in trash' }),
                deletedAt: new Date(),
            },
        });
        console.log('Created deleted account');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
