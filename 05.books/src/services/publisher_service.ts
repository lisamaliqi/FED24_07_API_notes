/**
 * Publisher Service
 */
import prisma from "../prisma";
import { CreatePublisherData, UpdatePublisherData } from "../types/Publisher.types";
import { BookId } from "../types/Book.types";

/**
 * Get all publishers
 */
export const getPublishers = async () => {
    return await prisma.publisher.findMany();
};

/**
 * Get a single publisher
 *
 * @param publisherId The ID of the Publisher to get
 */
export const getPublisher = async (publisherId: number) => {
    return await prisma.publisher.findUniqueOrThrow({
        where: {
            id: publisherId,
        },
        include: {
            books: true,
        },
    });
};

/**
 * Create a publisher
 *
 * @param data Publisher data
 */
export const createPublisher = async (data: CreatePublisherData) => {
    return await prisma.publisher.create({
        data: data,
    });
};

/**
 * Update a publisher
 *
 * @param publisherId The ID of the Publisher to update
 * @param data Publisher data
 * @returns
 */
export const updatePublisher = async (publisherId: number, data: UpdatePublisherData) => {
    return await prisma.publisher.update({
        where: {
            id: publisherId,
        },
        data: data,
    });
};

/**
 * Delete a publisher
 *
 * @param publisherId The ID of the Publisher to delete
 */
export const deletePublisher = async (publisherId: number) => {
    return await prisma.publisher.delete({
        where: {
            id: publisherId,
        }
    });
};


/**
 *
 * Link publisher to book(s)
 */
export const linkPublisherToBook = async (publisherId: number, bookIdOrIds: BookId | BookId[]) => {
    return await prisma.publisher.update({
        where: { 
            id: publisherId 
        },
        data: {
          books: {
            connect: bookIdOrIds,
          },
        },
        include: {
          books: true,
        },
      });
};



/**
 *
 * Unlink a book from a publisher
 */
export const unlinkBookFromPublisher = async (publisherId: number, bookId: number) => {
    return await prisma.publisher.update({
        where: { 
            id: publisherId 
        },
        data: {
          books: {
            disconnect: { 
                id: bookId 
            },
          },
        },
        include: { 
            books: true 
        },
      });
};