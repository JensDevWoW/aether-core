export interface Player {
    id: string;
    x: number;
    y: number;
    color: string;
}

export class World {
    private players: Record<string, Player> = {};

    addPlayer(id: string): void {
        this.players[id] = {
            id: id,
            // Random start pos
            x: Math.floor(Math.random() * 500),
            y: Math.floor(Math.random() * 500),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };

        console.log(`[WORLD] Added player ${id}`);
    }

    removePlayer(id: string): void {
        delete this.players[id];
        console.log(`[WORLD] Removed player ${id}`);
    }

    // Get the current state to send to clients
    getPLayers(): Record<string, Player> {
        return this.players;
    }
}