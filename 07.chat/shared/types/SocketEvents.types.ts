import { Room, User } from './Models.types'
export {}

// Events emitted by the server to the client
export interface ServerToClientEvents {
    chatMessage: (payload: ChatMessageData) => void;
    userJoined: (username: string, timestamp: number) => void;
}

// Events emitted by the client to the server
export interface ClientToServerEvents {
    getRoomList: ( 
        callback: (rooms: Room[]) => void 
    ) => void;

    sendChatMessage: (
        payload: ChatMessageData
    ) => void;

    userJoinRequest: (
        username: string, 
        roomId: string,
        callback: (response: UserJoinResponse) => void
    ) => void;
}

// Message payload
export interface ChatMessageData {
	content: string;
    roomId: string;
    timestamp: number;
    username: string;
}

// Room with users
export interface RoomWithUsers extends Room { //This is an extension of Room (from models.types.ts)
    users: User[];
}

// User join response 
export interface UserJoinResponse {
    success: boolean,
    room: RoomWithUsers | null
}