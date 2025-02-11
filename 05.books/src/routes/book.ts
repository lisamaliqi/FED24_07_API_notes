import express from "express";
import { index, show, store, update, destroy, addAuthor, removeAuthor } from "../controllers/book_controller";
import { createBookRules, updateBookRules } from "../validations/book_rules";
import { validateRequest } from "../middleware/validateRequest";

// Create a new Book router
const router = express.Router();


/**
 * GET /books
 *
 * Get all books
 */
router.get('/', index);



/**
 * GET /books/:bookId
 *
 * Get a single book 
 */
router.get('/:bookId', show);



/**
 * POST /books
 *
 * Create a book
 */
router.post('/', createBookRules, validateRequest, store);



/**
 * PATCH /books/:bookId
 *
 * Update a book
 */
router.patch('/:bookId', updateBookRules, validateRequest, update);



/**
 * DELETE /books/:bookId
 *
 * Delete a book
 */
router.delete('/:bookId', destroy);








/**
 * POST /books/:bookId/authors
 *
 * Link book to author(s)
 */
router.post("/:bookId/authors", addAuthor);



/**
 * DELETE /books/:bookId/authors/:authorId
 *
 * Unlink an author from a book
 */
router.delete("/:bookId/authors/:authorId", removeAuthor);

export default router;