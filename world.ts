import { Socket } from 'socket.io';
import { Player } from './Player';
import { Unit } from './Unit';

export class World {
    public players: Record<string, Player> = {};
    public units: Map<string, Unit> = new Map();

    addUnit(id: string): Unit {
        const newUnit = new Unit(id, `Unit${id}`, null);
        this.units.set(id, newUnit);
        console.log(`[WORLD] Added unit ${id}`);
        return newUnit;
    }

    addPlayer(socket: Socket): void {
        const id = socket.id;
        const newPlayer = new Player(socket);
        this.players[id] = newPlayer;
        this.units.set(socket.id, newPlayer);
        console.log(`[WORLD] Added player ${id}`);
    }

    removePlayer(socket: Socket): void {
        const id = socket.id;
        delete this.players[id];
        console.log(`[WORLD] Removed player ${id}`);
        this.units.delete(socket.id);
    }

    Update(dt: number){
        this.units.forEach((unit) => {
            unit.Update(dt);
        });
    }

    // Get the current state to send to clients
    getPlayers(): Record<string, Player> {
        return this.players;
    }

    getPlayerBySocket(socket: Socket): Player | null {
        const id = socket.id;
        return this.players[id] || null;
    }

    initTargets() {
        const target1 = this.addUnit('target1');
        const target2 = this.addUnit('target2');
        console.log(`[WORLD] Initialized targets: ${target1.guid}, ${target2.guid}`);
    }
}