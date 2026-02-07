import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// 1. THE WORLD STATE
// We store every connected player here.
// Key = Socket ID, Value = X/Y Coordinates
interface Player {
    id: string;
    x: number;
    y: number;
    color: string;
}

let players: Record<string, Player> = {};

io.on('connection', (socket: Socket) => {
    console.log(`[SYSTEM] Player Joined: ${socket.id}`);

    // 2. CREATE THE PLAYER
    // Give them a random starting position
    players[socket.id] = {
        id: socket.id,
        x: Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 500),
        color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random Hex Color
    };

    // 3. SEND THE WORLD STATE TO EVERYONE
    // "Hey everyone, a new guy is here. Here is the new list."
    io.emit('SMSG_PLAYER_UPDATE', players);

    // 4. HANDLE DISCONNECT
    socket.on('disconnect', () => {
        console.log(`[SYSTEM] Player Left: ${socket.id}`);
        delete players[socket.id]; // Remove from memory
        io.emit('SMSG_PLAYER_UPDATE', players); // Tell everyone they are gone
    });
});

server.listen(3000, () => {
    console.log(' AETHER WORLD SERVER ONLINE (Port 3000)');
});