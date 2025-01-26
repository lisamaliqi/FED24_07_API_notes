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

/**
 * GET /publishers/:publisherId
 *
 * Get a single publisher
 */
export const show = async (req: Request, res: Response) => {
	const publisherId = Number(req.params.publisherId);

	try {
		const publisher = await prisma.publisher.findUniqueOrThrow({
			where: {
				id: publisherId,
			},
			include: {
				books: true,
			},
		});
		res.send(publisher);

	} catch (err) {
		console.error(err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ message });
	}
};

/**
 * POST /publishers
 *
 * Create a publisher
 */
export const store = async (req: Request, res: Response) => {
	try {
		const publisher = await prisma.publisher.create({
			data: req.body,
		});
		res.status(201).send(publisher);

	} catch (err) {
		console.error(err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ message });
	}
};

/**
 * PATCH /publishers/:publisherId
 *
 * Update a publisher
 */
export const update = async (req: Request, res: Response) => {
	const publisherId = Number(req.params.publisherId);
	if (!publisherId) {
		res.status(400).send({ message: "That is not a valid ID" });
		return;
	}

	try {
		const publisher = await prisma.publisher.update({
			where: {
				id: publisherId,
			},
			data: req.body,
		});
		res.status(200).send(publisher);

	} catch (err) {
		console.error(err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ message });
	}
};

/**
 * DELETE /publishers/:publisherId
 *
 * Delete a publisher
 */
export const destroy = async (req: Request, res: Response) => {
	const publisherId = Number(req.params.publisherId);
	if (!publisherId) {
		res.status(400).send({ message: "That is not a valid ID" });
		return;
	}

	try {
		await prisma.publisher.delete({
			where: {
				id: publisherId,
			}
		});
		res.status(204).send();

	} catch (err) {
		console.error(err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ message });
	}
};
