import { Socket } from "socket.io";
import { World} from "./World";
import { Spell } from "./Spell";

export interface Packet {
    opcode: string;
    data: any;
}

export class OpcodeHandler {

    private handlers: Record<string, (socket: Socket, world: World, data: any) => void> = {};
    constructor(){
        this.registerOpcodes();
    }

    private registerOpcodes() {
        // CMSG_CAST_SPELL -> HandleSpellCast
        this.handlers["CMSG_CAST_SPELL"] = (socket, world, data) => this.handleSpellCast(socket, world, data);
        this.handlers["CMSG_AUTH"] = (socket, world, data) => this.handleAuth(socket, world, data);
        this.handlers["CMSG_SELECTED_TARGET"] = (socket, world, data) => this.handleSelectTarget(socket, world, data);
    }

    public route(socket: Socket, world: World, packet: Packet) {
        const handler = this.handlers[packet.opcode];
        if (handler) {
            handler(socket, world, packet.data);
        } else {
            console.warn(`No handler for opcode: ${packet.opcode}`);
        }
    }

    private handleSelectTarget(socket: Socket, world: World, data: any) {
        console.log(`[OPCODE] Handling target selection from socket ${socket.id} with data:`, data);
        const target = World.units.get(data.targetGuid);
        if (!target) {
            console.warn(`[TARGET] Target with GUID ${data.targetGuid} not found.`);
            return;
        }
        const player = world.getPlayerBySocket(socket);
        if (!player) {
            console.warn(`[TARGET] Player not found for socket ${socket.id}`);
            return;
        }
        // For simplicity, we just log the target selection. In a real implementation, you'd set the player's target.
        console.log(`[TARGET] Player ${player.guid} selected target ${target.guid}`);
    }

    private handleAuth(socket: Socket, world: World, data: any) {
        console.log(`[OPCODE] Handling auth from socket ${socket.id} with data:`, data);
        
        const { username, password } = data;

        if (password == "password123") {
            console.log(`[AUTH] Authentication successful for username: ${username}`);
            world.addPlayer(socket);
            socket.emit('SMSG_PACKET', {
                opcode: 'SMSG_AUTH_RESPONSE',
                data: {
                        success: true,
                        message: `Welcome to Aether, ${data.username}!`
                }
            });
        } else {
            console.warn(`[AUTH] Authentication failed for username: ${username}`);
            socket.emit('SMSG_PACKET', {
                opcode: 'SMSG_AUTH_RESPONSE',
                data: {
                        success: false,
                        message: `Authentication failed for ${data.username}.`
                }
            });
        }
    }

    private handleSpellCast(socket: Socket, world: World, data: any) {
        const player = world.getPlayerBySocket(socket);
        if (!player) {
            console.warn("Player not found for socket");
            return;
        }
        console.log(`[OPCODE] Handling spell cast from player ${player.socket.id} with data:`, data);
        const spell = new Spell(data.spellId, player);
        spell.prepare();
    }

}