import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { OpcodeHandler } from './OpcodeHandler';
import { World } from './World';
import { setIO } from './SocketManager';
const app = express();
const server = createServer(app);
const io = new Server(server);
setIO(io); // Make io globally accessible
app.use(express.static('public'));

const world = new World();
const opcodeHandler = new OpcodeHandler();

io.on('connection', (socket: Socket) => {
    console.log(`[SYSTEM] Player Joined: ${socket.id}`);

    // This catches EVERY single event sent by the client
    socket.onAny((eventName, args) => {
        console.log(`[ANY] Received Event: ${eventName}`, args);
    });

    socket.on('CMSG_PACKET', (packet) => {
        console.log(`[PACKET] Received packet from ${socket.id}:`, packet);
        opcodeHandler.route(socket, world, packet);
    });

    socket.on('disconnect', () => {
        console.log(`[SYSTEM] Player Disconnected: ${socket.id}`);
        world.removePlayer(socket);
    });
    
});

server.listen(3000, () => {
    console.log(' AETHER WORLD SERVER ONLINE (Port 3000)');
});

const TICK_RATE = 50; // 50 ms per tick = 20 ticks per second
let lastTime = Date.now();

setInterval(() => {
    const now = Date.now();
    const dt = now - lastTime;
    lastTime = now;

    // Update World
    world.Update(dt);
}, TICK_RATE);
