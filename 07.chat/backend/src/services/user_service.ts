/**
 * USER Service
 */

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
    });
};