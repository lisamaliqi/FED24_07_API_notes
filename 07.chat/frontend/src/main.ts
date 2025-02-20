import { io, Socket } from "socket.io-client";
import "./assets/scss/style.scss";
// import { ClientToServerEvents, ServerToClientEvents } from "../shared/types/SocketEvents.types";
import { ChatMessageData, ClientToServerEvents, ServerToClientEvents } from "../../shared/types/SocketEvents.types"

const SOCKET_HOST = import.meta.env.VITE_SOCKET_HOST as string;
console.log("SOCKET_HOST:", SOCKET_HOST);

const messageEl = document.querySelector("#message") as HTMLInputElement;
const messageFormEl = document.querySelector("#message-form") as HTMLFormElement;
// const messagesEl = document.querySelector("#messages") as HTMLDivElement;

// Connect to Socket.IO Server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_HOST);


// Listen for when connection is established
socket.on("connect", () => {
	console.log("💥 Connected to the server", socket.id);
});


// Listen for when server got tired of us
socket.on("disconnect", () => {
	console.log("🥺 Got disconnected from the server");
});



// Listen for new chat messages
socket.on("chatMessage", (payload) => {
	console.log("📨 YAY SOMEONE WROTE SOMETHING!!!!!!!", payload);
});



// Send message to the server when form is submitted
messageFormEl.addEventListener("submit", (e) => {
	e.preventDefault();

	// 💇
	const trimmedMessage = messageEl.value.trim();

	// If no message, no send
	if (!trimmedMessage) {
		return;
	};

	// Construct message payload
	const payload: ChatMessageData = {
		content: trimmedMessage,
	};

	// 📮 Send (emit) the message to the server
	socket.emit("sendChatMessage", payload);
	console.log("Emitted 'sendChatMessage' event to server", payload);

	// Clear input field
	messageEl.value = "";
	messageEl.focus();
});