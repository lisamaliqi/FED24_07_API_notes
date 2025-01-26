import express from "express";
import prisma from "../prisma";
import { handlePrismaError } from "../exceptions/prisma";
// Create a new Author router
const router = express.Router();


/**
 * GET /authors
 *
 * Get all authors
 */
router.get('/', async (req, res) => {
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
router.get('/:authorId', async (req, res) => {
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
router.post('/', async (req, res) => {
    try {
        const author = await prisma.author.create({
            data: req.body,
        });
        res.status(201).send(author);

    } catch (err) {
        console.log('error!', err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    }
});



/**
 * PATCH /authors/:authorId
 *
 * Update a author
 */
router.patch('/:authorId', async (req, res) => {
    const authorId = Number(req.params.authorId);

    if(!authorId) {
        res.status(400).send({
            message: 'Thats not a valid id, try again',
        });
        return; 
    };

    try {
        const author = await prisma.author.update({
            where: {
                id: authorId,
            },
            data: req.body,
        });
        res.status(200).send(author);

    } catch (err) {
        console.log('error!', err);
        const { status, message } = handlePrismaError(err);
        res.status(status).send({ message });
    }
});


/**
 * DELETE /authors/:authorId
 *
 * Delete a author
 */
router.delete('/:authorId', async (req, res) => {
    const authorId = Number(req.params.authorId);

    if(!authorId) {
        res.status(400).send({
            message: 'Id not found, try another one',
        });
        return;
    }

    try {
        const author = await prisma.author.delete({
            where: {
                id: authorId,
            },
        });
        res.status(204).send();

    } catch (err) {
        console.log('error!', err);
        const { status, message } = handlePrismaError(err)
        res.status(status).send({ message });
    }
}); 

export default router;