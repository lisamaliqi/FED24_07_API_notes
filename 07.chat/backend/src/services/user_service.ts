/**
 * USER Service
 */

import { User } from '@shared/types/Models.types';
import prisma from '../prisma';


/**
 * Get users currently online in room
 * 
 * @param roomId ID of room
 * @returns List of users in room
 */
export const getUsersInRoom = (roomId: string) => {
    return prisma.user.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            username: 'asc',
        },
    });
};



/**
 * Get a single user
 * 
 * @param userId User ID (in our app its the sockets id)
 * @returns user
 */
export const getUser = (userId: string) => {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
};



export const createUser = (data: User) => {
    return prisma.user.create({
        data
    });
};



/**
 * Delete a user
 *
 * @param userId ID of User to delete
 * @returns User
 */
export const deleteUser = (userId: string) => {
	return prisma.user.delete({
		where: {
			id: userId,
		},
	});
};



/**
 * Delete all the users [DANGER!]
 *
 */
export const deleteAllUsers = () => {
	return prisma.user.deleteMany();
};

