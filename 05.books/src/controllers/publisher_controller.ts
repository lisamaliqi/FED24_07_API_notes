/**
 * Publisher Controller
 */
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";
/**
 * Get all publishers
 *
 * GET /publishers
 */
export const index = async (req: Request, res: Response) => {
	try {
		const publishers = await prisma.publisher.findMany();
		res.send(publishers);
        
	} catch (err) {
		console.error(err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ message });
	};
};