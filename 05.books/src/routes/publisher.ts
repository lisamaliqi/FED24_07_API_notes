import express from "express";
import prisma from "../prisma";
import { handlePrismaError } from "../exceptions/prisma";
import { index } from "../controllers/publisher_controller";

// Create a new Publisher router
const router = express.Router();

/**
 * GET /publishers
 *
 * Get all publishers
 */
router.get("/", index);

/**
 * GET /publishers/:publisherId
 *
 * Get a single publisher
 */
router.get("/:publisherId", async (req, res) => {
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
});

/**
 * POST /publishers
 *
 * Create a publisher
 */
router.post("/", async (req, res) => {
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
});

/**
 * PATCH /publishers/:publisherId
 *
 * Update a publisher
 */
router.patch("/:publisherId", async (req, res) => {
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
});

/**
 * DELETE /publishers/:publisherId
 *
 * Delete a publisher
 */
router.delete("/:publisherId", async (req, res) => {
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
});

export default router;