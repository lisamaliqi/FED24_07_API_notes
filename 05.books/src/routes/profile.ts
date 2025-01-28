import express from "express";
import { index, show, store, update, destroy } from "../controllers/_controller";
import { getBooks, getProfile, updateProfile } from "../controllers/profile_controller";

// Create a new Resource router
const router = express.Router();

/**
 * GET /profile
 *
 * Get the authenticated users profile
 */
router.get("/", getProfile);

/**
 * GET /profile/books
 *
 * Get the authenticated users books
 */
router.get("/:resourceId", getBooks);


/**
 * PATCH /profile
 *
 * Update the autheticated users profile
 */
router.patch("/:resourceId", updateProfile);

/**
 * DELETE /resources/:resourceId
 *
 * Delete a resource
 */
router.delete("/:resourceId", destroy);

export default router;