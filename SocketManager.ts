import { Server } from 'socket.io';

export let io: Server;

export const setIO = (ioInstance: Server) => {
    io = ioInstance;
};