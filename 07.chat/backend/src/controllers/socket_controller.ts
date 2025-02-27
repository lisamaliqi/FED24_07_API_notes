/**
 * Socket Controller
 */
import Debug from "debug";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/types/SocketEvents.types";
import { createUser, deleteUser, getUser, getUsersInRoom } from "../services/user_service";
import { getRoom, getRooms } from "../services/room_service";

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

        const rooms = await getRooms();
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
        const room = await getRoom(roomId);

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
        const user = await createUser({
            id: socket.id,
			roomId,
			username,
        });
        debug("👶 Created user: %o", user);

        // 2. Retrieve list of Users in the room 
        const usersInRoom = await getUsersInRoom(roomId);

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

        // Broadcast a new list of users in the room everytime a user joins (so every user can see who's in the room)
        io.to(roomId).emit('usersInRoom', usersInRoom);
	});

	// Handle a user disconnecting
	socket.on("disconnect",async () => {
		debug("👋 A user disconnected", socket.id);

        // Find user in order to know which room (if any) they were in
        const user = await getUser(socket.id);

        // If user didn't exist, do nothing
        if (!user) {
            return; 
        };

        // If user exists -> Delete user
        await deleteUser(socket.id);
        // Retrieve a list of users still in the room
        const usersInRoom = await getUsersInRoom(user.roomId);


        
        // Broadcast a notice to the room that the user has left
        io.to(user.roomId).emit('userLeft', user.username, Date.now());

        
        // Also broadcast a new list of users in the room
        io.to(user.roomId).emit('usersInRoom', usersInRoom);
	});
};