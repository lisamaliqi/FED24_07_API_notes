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

	// Handle a user disconnecting
	socket.on("disconnect", () => {
		debug("👋 A user disconnected", socket.id);
	});

    // Say hello to the user
	setTimeout(() => {
		socket.emit("hello");
		debug("🤩 Said hello to the nice user", socket.id);
	}, 3000);
};