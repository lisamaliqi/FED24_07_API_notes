import express from "express";
import prisma from "../prisma";
import { handlePrismaError } from "../exceptions/prisma";
import { destroy, index, show, store, update, linkToBook, unlinkFromBook } from "../controllers/publisher_controller";
import { describe } from "node:test";
import { createPublisherRules, updatePublisherRules } from "../validations/publisher_rules";
import { validateRequest } from "../middleware/validateRequest";

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
router.get("/:publisherId", show);

/**
 * POST /publishers
 *
 * Create a publisher
 */
router.post("/", createPublisherRules, validateRequest, store);

/**
 * PATCH /publishers/:publisherId
 *
 * Update a publisher
 */
router.patch("/:publisherId", updatePublisherRules, validateRequest, update);

/**
 * DELETE /publishers/:publisherId
 *
 * Delete a publisher
 */
router.delete("/:publisherId", destroy);




/**
 * POST /publishers/:publisherId
 *
 * Update a publisher
 */
router.post("/:publisherId/book", linkToBook);

/**
 * DELETE /publishers/:publisherId
 *
 * Delete a publisher
 */
router.delete("/:publisherId/book/:bookId", unlinkFromBook);





export default router;