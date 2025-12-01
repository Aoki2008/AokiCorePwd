const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const project = await prisma.project.create({
            data: {
                name: 'Test Project',
                description: 'Created for verification',
            },
        });
        console.log('Created project:', project);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
