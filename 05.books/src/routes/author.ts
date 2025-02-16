import express from "express";
import { index, show, store, update, destroy } from "../controllers/author_controller";
import { CreateAuthorRules, updateAuthorRules } from "../validations/author_rules";
import { validateRequest } from "../middleware/validateRequest";

// Create a new Author router
const router = express.Router();

/**
 * GET /authors
 *
 * Get all authors
 */
router.get("/", index);


/**
 * GET /authors/:authorId
 *
 * Get a single author
 */
router.get("/:authorId", show);


/**
 * POST /authors
 *
 * Create a author
 */
router.post("/", CreateAuthorRules, validateRequest, store);


/**
 * PATCH /authors/:authorId
 *
 * Update a author
 */
router.patch("/:authorId", updateAuthorRules, validateRequest, update);


/**
 * DELETE /authors/:authorId
 *
 * Delete a author
 */
router.delete("/:authorId", destroy);

export default router;