import express from "express";
import prisma from "./prisma"; // importing the prisma instance we created
import morgan from "morgan";
import authorRouter from "./routes/author";
import { stat } from "fs";
import { error } from "console";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

//skicka funktionen handlePrismaError till exception/prisma.ts 

/**
 * GET /
 */
app.get("/", (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP folder 5!",
	});
});

//flytta alla get, post, patch och delete till author.ts i src/routes för att göra sidan fin 
//      Author routes
app.use(authorRouter);









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
app.post('/books', async (req, res) => {
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
app.patch('/books/:bookId', async (req, res) => {
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
app.delete('/books/:bookId', async (req, res) => {
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
app.post("/books/:bookId/authors", async (req, res) => {
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
app.delete("/books/:bookId/authors/:authorId", async (req, res) => {
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