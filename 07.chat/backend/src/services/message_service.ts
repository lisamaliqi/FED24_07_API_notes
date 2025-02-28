/**
 * MESSAGE Service
 */


import { ChatMessageData } from "@shared/types/SocketEvents.types";
import prisma from "../prisma";

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