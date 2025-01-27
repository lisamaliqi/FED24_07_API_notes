/**
 * Author Controller
 */
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";
import Debug from "debug";
import { validationResult } from "express-validator";

// Create a new debug instance
const debug = Debug("prisma-books:author_controller");

/**
 * Get all authors
 *
 * GET /authors
 */
export const index = async (req: Request, res: Response) => {
	try {
		const authors = await prisma.author.findMany();
		res.send({ status: "success", data: authors });

	} catch (err) {
		debug("Error when trying to query for all Authors: %O", err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ status: "error", message });
	}
}


/**
 * Get a single author
 *
 * GET /authors/:authorId
 */
export const show = async (req: Request, res: Response) => {
	const authorId = Number(req.params.authorId);

	try {
		const author = await prisma.author.findUniqueOrThrow({
			where: {
				id: authorId,
			},
			include: {
				books: true,
			},
		});
		res.send({ status: "success", data: author });

	} catch (err) {
		debug("Error when trying to query for Author #%d: %O", authorId, err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ status: "error", message });
	}
}


/**
 * Create a author
 *
 * POST /authors
 */
export const store = async (req: Request, res: Response) => {
	// Check for any validation errors
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		console.log("validationErrors:", validationErrors);
		res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		});
		return;
	};

    try {
		const author = await prisma.author.create({
			data: req.body,
		});
		res.status(201).send({ status: "success", data: author });

	} catch (err) {
		debug("Error when trying to create a Author: %O", err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ status: "error", message });
	}
}


/**
 * Update a author
 *
 * PATCH /authors/:authorId
 */
export const update = async (req: Request, res: Response) => {
	const authorId = Number(req.params.authorId);
	if (!authorId) {
		res.status(400).send({ message: "That is not a valid ID" });
		return;
	}

	try {
		const author = await prisma.author.update({
			where: {
				id: authorId,
			},
			data: req.body,
		});
		res.send({ status: "success", data: author });

	} catch (err) {
		debug("Error when trying to update Author #%d: %O", authorId, err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ status: "error", message });
	}
}


/**
 * Delete a author
 *
 * DELETE /authors/:authorId
 */
export const destroy = async (req: Request, res: Response) => {
	const authorId = Number(req.params.authorId);
	if (!authorId) {
		res.status(400).send({ message: "That is not a valid ID" });
		return;
	}

	try {
		await prisma.author.delete({
			where: {
				id: authorId,
			}
		});
		res.status(204).send();

	} catch (err) {
		debug("Error when trying to delete Author #%d: %O", authorId, err);
		const { status, message } = handlePrismaError(err);
		res.status(status).send({ status: "error", message });
	}
}