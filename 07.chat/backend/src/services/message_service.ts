/**
 * MESSAGE Service
 */


import { ChatMessageData } from "@shared/types/SocketEvents.types";
import prisma from "../prisma";

/**
 * Get Latest messages sent to a room
 * 
 * @param roomId Room Id
 * @returns Messages
 */
export const getLatestMessagesByRoom = (roomId: string) => {
    return prisma.message.findMany({
        where: {
            roomId: roomId,
        },
        orderBy: {
            timestamp: 'asc',
        },
    });
};



/**
 * Create a message (save)
 * 
 * @param data Message info
 * @returns Message
 */
export const createMessage = (data: ChatMessageData) => {
    return prisma.message.create({
        data,
    });
};