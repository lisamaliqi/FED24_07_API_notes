/**
 * MESSAGE Service
 */


import { ChatMessageData } from "@shared/types/SocketEvents.types";
import prisma from "../prisma";
import { timeStamp } from "console";

/**
 * Get Latest messages sent to a room
 * 
 * @param roomId Room Id
 * @returns Messages
 */
export const getLatestMessagesByRoom = (roomId: string, maxAge = 3600) => {
    //get current date
    
    const past = Date.now() - maxAge * 1000;

    return prisma.message.findMany({
        where: {
            roomId: roomId,
            timestamp: {
                gte: past, //greater than or equal to past   (timestamp >= past)
            },
        },
        orderBy: {
            timestamp: 'asc',
        },
        take: -10, //take the last 10 messages in the database
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