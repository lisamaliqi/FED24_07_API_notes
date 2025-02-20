/**
 * Socket Controller
 */
import Debug from "debug";
import { Socket } from "socket.io";

// Create a new debug instance
const debug = Debug('chat:socket_controller');


// Handle a user connecting
export const handleConnection = (socket: Socket) => {
	debug("🙋 A user connnected", socket.id);

	// Handle a user disconnecting
	socket.on("disconnect", () => {
		debug("👋 A user disconnected", socket.id);
	});
}