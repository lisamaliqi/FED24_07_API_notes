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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		socket.broadcast.emit("chatMessage", payload);
	});

    // Listen for a user join request
	socket.on("userJoinRequest", (username, callback) => {  // request
		debug("👶🏽 User %s from socket %s wants to join the chat", username, socket.id);

		// Always let the user in (for now 😇)
		// We probably should check if the username is already in use
		// and if so, deny access
		callback(true);  // response

        // Broadcast to everyone that a new user has joined
        socket.broadcast.emit("userJoined", username, Date.now());
	});

	// Handle a user disconnecting
	socket.on("disconnect", () => {
		debug("👋 A user disconnected", socket.id);
	});
};