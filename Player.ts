import { Socket } from 'socket.io';
import { Unit } from './Unit';

export class Player extends Unit {
    public xp: number = 0;
    public level: number = 1
    private gcdTimer: number = 0;

    constructor(public socket: Socket) {
        super(socket.id, `Player${socket.id}`, socket);
        this.SetIsPlayer();
        this.name = "New Player";
        console.log(`[PLAYER] Created player with id ${socket.id}`);
    }

    die() {
        super.die();
        console.log(`[PLAYER] Player ${this.socket.id} has died.`);
    }

    SetOnGCD() {
        this.gcdTimer = 1500; // 1.5 seconds GCD
    }

    IsOnGCD(): boolean {
        return this.gcdTimer > 0;
    }

    Update(deltaTime: number) {
        if (this.gcdTimer > 0) {
            this.gcdTimer -= deltaTime;
            if (this.gcdTimer < 0) this.gcdTimer = 0;
        }
    }
}