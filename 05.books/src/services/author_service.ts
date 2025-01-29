/**
 * Author Service
 */
import prisma from "../prisma";
import { CreateAuthorData, UpdateAuthorData } from "../types/Author.types";

/**
 * Get all authors
 */
export const getAuthors = async () => {
    return await prisma.author.findMany();
};

/**
 * Get a single author
 *
 * @param authorId The ID of the Author to get
 */
export const getAuthor = async (authorId: number) => {
    return await prisma.author.findUniqueOrThrow({
        where: {
            id: authorId,
        },
        include: {
            books: true,
        },
    });
};

/**
 * Create an author
 *
 * @param data Author data
 */
export const createAuthor = async (data: CreateAuthorData) => {
    return await prisma.author.create({
        data: data,
    });
};

/**
 * Update an author
 *
 * @param authorId The ID of the Author to update
 * @param data Author data
 * @returns
 */
export const updateAuthor = async (authorId: number, data: UpdateAuthorData) => {
    return await prisma.author.update({
        where: {
            id: authorId,
        },
        data: data,
    });
};

/**
 * Delete an author
 *
 * @param authorId The ID of the Author to delete
 */
export const deleteAuthor = async (authorId: number) => {
    return await prisma.author.delete({
        where: {
            id: authorId,
        },
    });
};
