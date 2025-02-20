/**
 * Socket Controller
 */
import Debug from "debug";
import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/types/SocketEvents.types";

// Create a new debug instance
const debug = Debug('chat:socket_controller');


// Handle a user connecting
export const handleConnection = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
	debug("🙋 A user connnected", socket.id);

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
	});

	// Handle a user disconnecting
	socket.on("disconnect", () => {
		debug("👋 A user disconnected", socket.id);
	});
};