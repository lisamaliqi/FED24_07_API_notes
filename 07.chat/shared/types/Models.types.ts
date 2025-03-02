export {}

export interface Room {
    id: string;
    name: string;
}

export interface User {
    id: string;             //socket.id
    username: string;
    roomId: string;         //objectId from room db in api07chat
}
/* 

export interface Message {
    id: string;
    content: string;
    timestamp: number;
    username: string;
    roomId: string;
} */