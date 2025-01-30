/**
 * Author Service
 */
import { Request } from "express-validator/lib/base";
import prisma from "../prisma";
import { CreateBookData, UpdateBookData } from "../types/Book.types";
import { AuthorId } from "../types/Author.types";

/**
 * Get all books
 */
export const getBooks = async () => {
    return await prisma.book.findMany();
};

/**
 * Get a single book
 *
 * @param bookId The ID of the book to get
 */
export const getBook = async (bookId: number) => {
    return await prisma.book.findUniqueOrThrow({
        where: {
            id: bookId,
        }, 
        include: {
            authors: true,
            publisher: true,
        },
    });
};

/**
 * Create a book
 *
 * @param data book data
 */
export const createBook = async (data: CreateBookData) => {
    return await prisma.book.create({
        data: data,
    });
};

/**
 * Update a book
 *
 * @param bookId The ID of the Book to update
 * @param data Book data
 * @returns
 */
export const updateBook = async (bookId: number, data: UpdateBookData) => {
    return await prisma.book.update({
        where: {
            id: bookId,
        },
        data: data,
    });
};

/**
 * Delete a book
 *
 * @param bookId The ID of the Book to delete
 */
export const deleteBook = async (bookId: number) => {
    return await prisma.book.delete({
        where: {
            id: bookId,
        },
    });
};


/**
 * Link book to author(s)
 * 
 * @param bookId the Id of the book to link
 * @param authorIdOrIds the ID(s) of the author(s)
 */
export const linkBookToAuthor = async (bookId: number, authorIdOrIds: AuthorId | AuthorId[]) => {
    return await prisma.book.update({
        where: {
            id: bookId,
        },
        data: {
            authors: {
                connect: authorIdOrIds,  // { "id": 8 }
            },
        },
        include: {
            authors: true,
        },
    });
};



/**
 * DELETE /books/:bookId/authors/:authorId
 *
 * Unlink an author from a book
 */
export const unlinkAuthorFromBook = async (bookId: number, authorId: number) => {
    return await prisma.book.update({
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
};