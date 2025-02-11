import express from "express";
import { index, show, store, update, destroy } from "../controllers/_controller";
import { addBooks, getBooks, getProfile, removeBook, updateProfile } from "../controllers/profile_controller";
import { updateUserRules } from "../validations/user_rules";
import { validateRequest } from "../middleware/validateRequest";

// Create a new Resource router
const router = express.Router();

/**
 * GET /profile
 *
 * Get the authenticated users profile
 */
router.get("/", getProfile);


/**
 * PATCH /profile
 *
 * Update the authenticated user's profile
 */
router.patch("/", updateUserRules, validateRequest, updateProfile);


/**
 * GET /profile/books
 *
 * Get the authenticated users books
 */
router.get("/:resourceId", getBooks);


/**
 * POST /profile/books
 *
 * Link books to authenticated user
 */
router.post("/books", addBooks);


/**
 * DELETE /profile/books/:bookId
 *
 * Unlink book from authenticated user
 */
router.delete("/books/:bookId", removeBook);


export default router;