import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Here be all your seeds 🌱
	await prisma.publisher.upsert({
		where: { id: 1 },
		update: {},
		create: { id: 1, name: "Hutchinson" },
	});

	await prisma.publisher.upsert({
		where: { id: 2 },
		update: {},
		create: { id: 2, name: "Gnome Press" },
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
