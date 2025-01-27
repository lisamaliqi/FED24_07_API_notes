/**
 * Book Controller
 */
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";
import Debug from "debug";

// Create a new debug instance
const debug = Debug("prisma-books:book_controller");

/**
 * GET /books
 *
 * Get all books
 */
export const index = async (req: Request, res: Response) => {
    try {
        const books = await prisma.book.findMany();
        res.send({ status: "success", data: books });

    } catch (err) {
        debug("Error when trying to query for all Books: %O", err);
        const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    }
};



/**
 * GET /books/:bookId
 *
 * Get a single book 
 */
export const show = async (req: Request, res: Response) => {
    const bookId = Number(req.params.bookId);

    if (!bookId) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	}

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
                publisher: true,
            },
        });
        res.send({ status: "success", data: book });

    } catch (err) {
        debug("Error when trying to query for Book #%d: %O", bookId, err);
        const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    }
};



/**
 * POST /books
 *
 * Create a book
 */
export const store = async (req: Request, res: Response) => {
    try {
        const book = await prisma.book.create({
            data: req.body,
        });
        res.status(201).send({ status: "success", data: book });

    } catch (err) {
        debug("Error when trying to create a Book: %O", err);
        const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    };
};



/**
 * PATCH /books/:bookId
 *
 * Update a book
 */
export const update = async (req: Request, res: Response) => {
    const bookId = Number(req.params.bookId);

    if(!bookId){
        console.log('error!');
        res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
        return;
    };

    try {
        const book = await prisma.book.update({
            where: {
                id: bookId,
            },
            data: req.body,
        });
        res.send({ status: "success", data: book });

    } catch (err) {
        debug("Error when trying to update Book #%d: %O", bookId, err);
        const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    };
};



/**
 * DELETE /books/:bookId
 *
 * Delete a book
 */
export const destroy = async (req: Request, res: Response) => {
    const bookId = Number(req.params.bookId);

    if(!bookId) {
        res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
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
        debug("Error when trying to delete Book #%d: %O", bookId, err);
        const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    }
};








/**
 * POST /books/:bookId/authors
 *
 * Link book to author(s)
 */
export const addAuthor = async (req: Request, res: Response) => {
    const bookId = Number(req.params.bookId);
    if (!bookId) {
        res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
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
        res.status(201).send({ status: "success", data: book });

    } catch (err) {
        debug("Error when trying to add Author %j to Book #%d: %O", req.body, bookId, err);
        const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    }
};



/**
 * DELETE /books/:bookId/authors/:authorId
 *
 * Unlink an author from a book
 */
export const removeAuthor = async (req: Request, res: Response) => {
    const bookId = Number(req.params.bookId);
    const authorId = Number(req.params.authorId);
    if (!bookId || !authorId) {
        res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
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
        res.status(200).send({ status: "success", data: book });

    } catch (err) {
        debug("Error when trying to remove Author #%d from Book #%d: %O", authorId, bookId, err);
        const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
    }
};