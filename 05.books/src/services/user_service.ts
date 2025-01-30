/**
 * User service 
 */

import prisma from "../prisma"

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