/**
 * User service 
 */

import prisma from "../prisma"
import { BookId } from "../types/Book.types";
import { CreateUserData, UpdateUserData } from "../types/User.types";

/**
 * Get a User by email
 *
 * @param email Email of user to get
 */
export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
};


/**
 * Get a User by ID
 *
 * @param id Id of user to get
 */
export const getUserById = (userId: number) => {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
	});
}



/**
 * Create a user
 *
 * @param data User data
 */
export const createUser = (data: CreateUserData) => {
    return prisma.user.create({
        data: data,


            // name: validateData.name,
            // email: validateData.email,
            // password: hashed_password, 
            // //gör jag ej detta så kommer mitt password inte bli hashat och därmed synas i db (INTE BRA)

            //gör detta istället för det där över, detta säger:
            //sprid ut det som finns i validateData, men skriv över password med hashed_password
            // ...validateData,
            // password: hashed_password,
    });
};



/**
 * Update a user
 * 
 * @param userId 
 * @param data 
 * @returns 
 */

export const updateUser = (userId: number, data: UpdateUserData) => {
    return prisma.user.update({
        where: {
            id: userId
        },
        data: data,
    });
};




/**
 * Get a users book
 * 
 * @param userId 
 */
/* 
//detta är en annan väg, behövs ej då jag redan har getBooks i profile_controller
export const getUserBooks = async (userId: number) => {
    const user = await prisma.user.findUniqueOrThrow({
        select: {
            books: true,
        },
        where: {
            id: userId
        },
    });

    return user.books;
}; */


/**
 * link books to user 
 * 
 * @param userId ID of user
 * @param bookIdOrBooksIds book ID(s) to link
 * @returns 
 */
export const linkBooksToUser = async (userId: number, bookIdOrBooksIds: BookId | BookId[]) => {
    const user = await prisma.user.update({
        select: {
            books: true
        },
        where: {
            id: userId,
        },
        data: {
            books: {
                connect: bookIdOrBooksIds,
            },
        },
    });

    return user.books;
};


/**
 * Remove book from user
 * 
 * @param userId User ID
 * @param bookId Book ID to remove
 */

export const unlinkBookFromUser = async (userId: number, bookId: number) => {
    const user = await prisma.user.update({
        select: {
            books: true
        },
        where: {
            id: userId,
        },
        data: {
            books: {
                disconnect: {
                    id: bookId,
                },
            },
        },
    });
};