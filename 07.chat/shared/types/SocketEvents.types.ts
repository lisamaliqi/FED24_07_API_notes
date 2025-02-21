import { Room } from './Models.types'
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
        callback: (success: boolean) => void
    ) => void;
}

// Message payload
export interface ChatMessageData {
	content: string;
    timestamp: number;
    username: string;
}