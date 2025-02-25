/**
 * Socket Controller
 */
import Debug from "debug";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/types/SocketEvents.types";
import prisma from "../prisma";

// Create a new debug instance
const debug = Debug('chat:socket_controller');


// Handle a user connecting
export const handleConnection = (
    socket: Socket<ClientToServerEvents, ServerToClientEvents>,
    io: Server<ClientToServerEvents, ServerToClientEvents>
) => {
	debug("🙋 A user connnected", socket.id);

    // Listen for room list request
    socket.on('getRoomList', async (callback) => {
        debug('🏠Got request for rooms!');

        const rooms = await prisma.room.findMany({
            orderBy: {
                name: 'asc', //sortera i bokstavsordning
            },
        });
        debug('Found the rooms, sending list of rooms %o', rooms);

        // Send list of rooms as acknowledgement of the event 
        setTimeout(() => {
            callback(rooms);
        }, 1500);
    }); 

    // Listen for incoming chat messages
	socket.on("sendChatMessage", (payload) => {
		debug("📨 New chat message", socket.id, payload);

		// Broadcast message to everyone connected EXCEPT the sender
		socket.to(payload.roomId).emit("chatMessage", payload);
	});

    // Listen for a user join request
	socket.on("userJoinRequest", async (username, roomId, callback) => {  // request
		debug("👶🏽 User %s from socket %s wants to join room %s", username, socket.id, roomId);

        // Get room from database
        const room = await prisma.room.findUnique({
            where: {
                id: roomId,
            }
        });

        // If room was not found  -> respond with success = false
        if (!room) {
            callback({
                success: false,
                room: null,
            });
            return; //important to have return or else the code will continue running, not good
        };

        // Join room `roomId`
        socket.join(roomId);

        // 1. Create user, set id to socket.id and roomId to the roomId they want to join
        await prisma.user.create({
            data: {
                id: socket.id,
                roomId: roomId,
                username: username, 
            }
        });


        // 2. Retrieve list of Users in the room 
        const usersInRoom = await prisma.user.findMany({
            where: {
                roomId: roomId
            }
        });

        // Respond with room info
        // (here we could also check the username and deny access if it was already in use)
		callback({
            success: true,
            room: {
                id: room.id, 
                name: room.name,
                users: usersInRoom, // 2. Respond with list of Users in the room
            },

            /**
             u could also do this: 
             room {
                ...room,
                users: [],
             }
             */
        });  // response

        // Broadcast to everyone in the room (including ourselves) that a user has joined
        io.to(roomId).emit("userJoined", username, Date.now());
	});

	// Handle a user disconnecting
	socket.on("disconnect", () => {
		debug("👋 A user disconnected", socket.id);
	});
};