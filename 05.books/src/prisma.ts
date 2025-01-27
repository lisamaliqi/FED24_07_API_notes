import { PrismaClient } from "@prisma/client";
//syntax för att logga ut SQL queries i consollen (gör detta ENDAST vid debugging av prisma)
const prisma = new PrismaClient({
	// log: ["query", "error", "info", "warn"],
});
export default prisma;