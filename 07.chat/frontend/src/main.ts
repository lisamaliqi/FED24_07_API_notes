import { io, Socket } from "socket.io-client";
import "./assets/scss/style.scss";
// import { ClientToServerEvents, ServerToClientEvents } from "../shared/types/SocketEvents.types";
import { ChatMessageData, ClientToServerEvents, ServerToClientEvents, UserJoinResponse } from "../../shared/types/SocketEvents.types"
import { User } from "@shared/types/Models.types";

const SOCKET_HOST = import.meta.env.VITE_SOCKET_HOST as string;
console.log("SOCKET_HOST:", SOCKET_HOST);



// Forms
const loginFormEl = document.querySelector("#login-form") as HTMLFormElement;
const loginUsernameInputEl = document.querySelector("#username") as HTMLInputElement;
const loginConnectBtnEl = document.querySelector('#connectBtn') as HTMLButtonElement;
const loginRoomSelectEl = document.querySelector('#room') as HTMLSelectElement;
const messageEl = document.querySelector("#message") as HTMLInputElement;
const messageFormEl = document.querySelector("#message-form") as HTMLFormElement;


// Lists
const messagesEl = document.querySelector("#messages") as HTMLDivElement;


// Views
const chatView = document.querySelector("#chat-wrapper") as HTMLDivElement;
const loginView = document.querySelector("#login-wrapper") as HTMLDivElement;


// User Details
let roomId: string | null = null;
let username: string | null = null;


// Connect to Socket.IO Server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_HOST);


/**
 * Functions
 */

// Add message history to chat
const addMessageHistoryToChat = (messageHistory: ChatMessageData[]) => {
    console.log('🍍Adding messages to chat...');
    
    //clear any previous messages from the chat
    messageEl.innerHTML = '';

    //loop over messages and add them to the chat
    messageHistory.forEach(message => {
        addMessageToChat(message);
    });
};



// add message to chat
const addMessageToChat = (payload: ChatMessageData, ownMessage = false) => {
	// Create a new LI element
	const msgEl = document.createElement("li");

	// Set CSS-classes
	msgEl.classList.add("message");

    // If it's our own message, add the `own-message` class
	if (ownMessage) {
		msgEl.classList.add("own-message");
	};

    // Get human readable time
	const time = new Date(payload.timestamp).toLocaleTimeString();  // "13:37:00"

	// Set text content
	msgEl.innerHTML = ownMessage
		? `
			<span class="content">${payload.content}</span>
            <span class="time">${time}</span>
		`
		: `
			<span class="user">${payload.username}</span>
			<span class="content">${payload.content}</span>
            <span class="time">${time}</span>
		`;

	// Append LI to messages list
	messagesEl.appendChild(msgEl);

    // Scroll down to the last message automatically, but very smooth ;)
    msgEl.scrollIntoView({ behavior: 'smooth' });
};


// add notice to chat
const addNoticeToChat = (msg: string, timestamp?: number) => {
    if(!timestamp) {
        timestamp = Date.now();
    };

	// Create a new LI element
	const noticeEl = document.createElement("li");

	// Set CSS-classes
	noticeEl.classList.add("notice");

    // Get human readable time
	const time = new Date(timestamp).toLocaleTimeString();  // "13:37:00"

	// Set text content
	noticeEl.innerHTML = 
		`
			<span class="content">${msg}</span>
            <span class="time">${time}</span>
		`;

	// Append LI to messages list
	messagesEl.appendChild(noticeEl);

    // Scroll down to the last notice automatically, but very smooth ;)
    noticeEl.scrollIntoView({ behavior: 'smooth' });
};


// Show chat view
const showChatView = () => {
	loginView.classList.add("hide");
	chatView.classList.remove("hide");
};


// Show login view
const showLoginView = () => {
    // Disable 'Connect' button and clear room-list
    loginConnectBtnEl.disabled = true;
    loginRoomSelectEl.innerHTML = `<option selected>Loading...</option>`;


    // request a list of rooms from the server
    // once we get them, populate the `<select>` element with the rooms
    // after that, enable the "connect" button
    console.log('Requesting rooms...');
    socket.emit('getRoomList', (rooms) => {
        //we got rooms
        console.log('Yay, our rooms!!', rooms);

        // Update room list with option for each room
        loginRoomSelectEl.innerHTML = rooms
            .map(room => `<option value="${room.id}">${room.name}</option>`)
            .join('');

        // Enable connect button once we have a list of rooms
        loginConnectBtnEl.disabled = false;

        
    });
    
	chatView.classList.add("hide");
	loginView.classList.remove("hide");
};


// Update list of online users in the room
const updateOnlineUsers = (users: User[]) => {
    const onlineUsersEl = document.querySelector('#online-users') as HTMLUListElement;
    onlineUsersEl.innerHTML = users
        .map(user => 
            user.id === socket.id
            ? `<li class="me"><span">&#x1f9b8</span>${user.username}</li>`
            : `<li><span>🦹🏻</span>${user.username} </li>`
        )
        .join('');
};



/**
 * Socket Handlers
 */

const userJoinRequestCallback = (response: UserJoinResponse) => {
    // This will only be executed once the server has responded
    console.log("Join response?", response);

    if (!response.success || !response.room) {
        alert("Could not join room (for some reason...)");
        return;
    };
    
    // Update chat view title with room name
    const chatTitleEl = document.querySelector('#chat-title') as HTMLHeadingElement;
    chatTitleEl.innerText = response.room.name;
    
    //Add message history to chat
    addMessageHistoryToChat(response.room.messages);
    
    // Update list of online users in the room
    updateOnlineUsers(response.room.users);

    // Show chat view
    showChatView();
};




/**
 * Socket Event Listeners
 */

// Listen for when connection is established
socket.on("connect", () => {
	console.log("💥 Connected to the server", socket.id);

    //show login view
    showLoginView();
});


// Listen for when server got tired of us
socket.on("disconnect", () => {
	console.log("🥺 Got disconnected from the server");
    addNoticeToChat('You have been disconnected from the server');
});

// Listen for when we're reconnected (our own fault or servers fault)
socket.io.on("reconnect", () => {
    console.log("🔌 Reconnected to the server");

    // emit userJoinRequest event but ONLY if we were in the chat previously
    if (username && roomId) {
        socket.emit("userJoinRequest", username, roomId, userJoinRequestCallback);
        addNoticeToChat("You're reconnected!");
    };
});


// Listen for an updated list of online users
socket.on('usersInRoom', (users) => {
    console.log('Got a new list of online users📃', users);

    // Update list of online users in the room
    updateOnlineUsers(users);
    
});


// Listen for new chat messages
socket.on("chatMessage", (payload) => {
	console.log("📨 YAY SOMEONE WROTE SOMETHING!!!!!!!", payload);
    addMessageToChat(payload);
});


// Listen for when a new user joins the chat
socket.on("userJoined", (username, timestamp) => {
    console.log("👶🏽 a new user joined the chat", username, timestamp);
    addNoticeToChat(`${username} has joined the chat`, timestamp);
});


// Listen for when a user leaves the chat
socket.on("userLeft", (username, timestamp) => {
    console.log("😔 a user has left the chat", username, timestamp);
    addNoticeToChat(`😳${username} has left the building`, timestamp);
});




/**
 * DOM Event Listeners
 */

// Save username and show chat
loginFormEl.addEventListener("submit", (e) => {
	e.preventDefault();

	//  Get username and roomId
	username = loginUsernameInputEl.value.trim();
    roomId = loginRoomSelectEl.value;


	// If no username or room, no join
	if (!username || !roomId) {
		alert("No username or room? No chat 4 you!");
		return;
	};

	// Emit `userJoinRequest`-event to server and
	// WAIT for acknowledgement
	// BEFORE showing chat view
	socket.emit("userJoinRequest", username, roomId, userJoinRequestCallback);
	console.log("Emitted 'userJoinRequest' event to server", username, roomId);
});


// Send message to the server when form is submitted
messageFormEl.addEventListener("submit", (e) => {
	e.preventDefault();

	// 💇
	const trimmedMessage = messageEl.value.trim();

	// If no message, no send
	if (!trimmedMessage || !username || !roomId) {
		return;
	};

	// Construct message payload
	const payload: ChatMessageData = {
		content: trimmedMessage,
        timestamp: Date.now(),
        roomId,
        username,
	};

	// 📮 Send (emit) the message to the server
	socket.emit("sendChatMessage", payload);
	console.log("Emitted 'sendChatMessage' event to server", payload);

    // Add our own message to the chat
	addMessageToChat(payload, true);

	// Clear input field
	messageEl.value = "";
	messageEl.focus();
});