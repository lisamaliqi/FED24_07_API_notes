import express from "express";
import prisma from "./prisma"; // importing the prisma instance we created
import morgan from "morgan";
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { stat } from "fs";
import { error } from "console";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

//funktion som hanterar errors så man slipper skriva error-kod för varje request
const handlePrismaError = (err: unknown) => {
	if (err instanceof PrismaClientInitializationError) {
		return { status: 500, message: "Error initializing connection to database" };

	} else if (err instanceof PrismaClientKnownRequestError) {
		if (err.code === "P2021") {
			return { status: 500, message: "Database table does not exist" };

		} else if (err.code === "P2025") {
			return { status: 404, message: "Not Found" };
		}

	} else if (err instanceof PrismaClientValidationError) {
		return { status: 400, message: "Validation Error" };

	}

	return { status: 500, message: "Something went wrong when querying the database" };
}

/**
 * GET /
 */
app.get("/", (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP folder 5!",
	});
});

//          AUTHORS
/**
 * GET /authors
 *
 * Get all authors
 */
app.get('/authors', async (req, res) => {
    try {
        const authors = await prisma.author.findMany();
        res.send(authors);

    } catch (err) {
        console.log('error!', err);
        const { status, message } = handlePrismaError(err);
		res.status(status).send({ message });
    };
});



/**
 * GET /authors/:authorId
 *
 * Get a single author 
 */
app.get('/authors/:authorId', async (req, res) => {
    const authorId = Number(req.params.authorId);

    if (!authorId) {
        console.log('error!');
        res.status(404).send({ 
            message: 'Id not found, try another one!',
        });
        return;
    };

    try {
        const author = await prisma.author.findUniqueOrThrow({
            where: {
                id: authorId,
            }, 
            include: {
                books: true,
            },
        });
        res.send(author);

    } catch (err){
        console.log('error!', err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    };
});



/**
 * POST /authors
 *
 * Create a author
 */





/**
 * PATCH /authors/:authorId
 *
 * Update a author
 */





/**
 * DELETE /authors/:authorId
 *
 * Delete a author
 */






//          BOOKS
/**
 * GET /books
 *
 * Get all books
 */
app.get('/books', async (req, res) => {
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
app.get('/books/:bookId', async (req, res) => {
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





/**
 * PATCH /books/:bookId
 *
 * Update a book
 */





/**
 * DELETE /books/:bookId
 *
 * Delete a book
 */




/**
 * Catch-all route handler
 */
app.use((req, res) => {
	// Respond with 404 and a message in JSON-format
	res.status(404).send({
		message: `Cannot ${req.method} ${req.path}`,
	});
});

export default app;