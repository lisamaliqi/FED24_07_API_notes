import express from "express";
import prisma from "../prisma";
import { handlePrismaError } from "../exceptions/prisma";
// Create a new Book router
const router = express.Router();


/**
 * GET /books
 *
 * Get all books
 */
router.get('/books', async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        res.send(books);

    } catch (err) {
        console.log(err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    }
});



/**
 * GET /books/:bookId
 *
 * Get a single book 
 */
router.get('/books/:bookId', async (req, res) => {
    const bookId = Number(req.params.bookId);

    if (!bookId) {
        console.log('erro!');
        res.status(404).send({
            message: 'That id is not valid, try a new one',
        });
        return;
    };

    try {
        const book = await prisma.book.findUniqueOrThrow({
            where: {
                id: bookId,
            }, 
            include: {
                authors: true,
            },
        });
        res.send(book);

    } catch (err) {
        console.log('error!', err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    }
});



/**
 * POST /books
 *
 * Create a book
 */
router.post('/books', async (req, res) => {
    try {
        const book = await prisma.book.create({
            data: req.body,
        });
        res.status(201).send(book);

    } catch (err) {
        console.log('error!', err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    };
});



/**
 * PATCH /books/:bookId
 *
 * Update a book
 */
router.patch('/books/:bookId', async (req, res) => {
    const bookId = Number(req.params.bookId);

    if(!bookId){
        console.log('error!');
        res.status(404).send({
            message: 'Id not found, try again',
        });
        return;
    };

    try {
        const book = await prisma.book.update({
            where: {
                id: bookId,
            },
            data: req.body,
        });
        res.status(200).send(book);

    } catch (err) {
        console.log('error!!', err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    };
});



/**
 * DELETE /books/:bookId
 *
 * Delete a book
 */
router.delete('/books/:bookId', async (req, res) => {
    const bookId = Number(req.params.bookId);

    if(!bookId) {
        res.status(404).send({
            message: 'Id not found, try another one',
        });
        return;
    };

    try {
        const book = await prisma.book.delete({
            where: {
                id: bookId,
            },
        });
        res.status(204).send();

    } catch (err) {
        console.log('error!', err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    }
});








/**
 * POST /books/:bookId/authors
 *
 * Link book to author(s)
 */
router.post("/books/:bookId/authors", async (req, res) => {
    const bookId = Number(req.params.bookId);
    if (!bookId) {
        res.status(400).send({ message: "That is not a valid ID" });
        return;
    }

    try {
        const book = await prisma.book.update({
            where: {
                id: bookId,
            },
            data: {
                authors: {
                    connect: req.body,  // { "id": 8 }
                },
            },
            include: {
                authors: true,
            },
        });
        res.status(201).send(book);
    } catch (err) {
        console.error(err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    }
});



/**
 * DELETE /books/:bookId/authors/:authorId
 *
 * Unlink an author from a book
 */
router.delete("/books/:bookId/authors/:authorId", async (req, res) => {
    const bookId = Number(req.params.bookId);
    const authorId = Number(req.params.authorId);
    if (!bookId || !authorId) {
        res.status(400).send({ message: "That is not a valid ID" });
        return;
    }

    try {
        const book = await prisma.book.update({
            where: {
                id: bookId,
            },
            data: {
                authors: {
                    disconnect: {
                        id: authorId,
                    },
                },
            },
            include: {
                authors: true,
            },
        });
        res.status(200).send(book);
    } catch (err) {
        console.error(err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    }
});

export default router;