import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	// Here be all your seeds 🌱
    // upsert = create or update a room
    await prisma.room.upsert({
        where: {
            name: 'Captain', //look after this name
        },
        update: {}, //if name exists, update it
        create: { 
            name: 'Captain', //if name doesn't exist, create one named Captain
        },
    });

    await prisma.room.upsert({
        where: {
            name: 'General',
        },
        update: {},
        create: {
            name: 'General',
        },
    });

    await prisma.room.upsert({
        where: {
            name: 'Major',
        },
        update: {},
        create: {
            name: 'Major',
        },
    });
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e: unknown) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});