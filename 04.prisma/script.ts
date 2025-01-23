import { PrismaClient } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();

async function main() {
	// ... you will write your Prisma Client queries here
	console.log("It works?");

    // Hämta ut alla phones från databasen och logga ut det i konsollen med prisma 
	// SELECT * FROM phones
	const phones = await prisma.phones.findMany();
	console.log("Phones:", phones);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});