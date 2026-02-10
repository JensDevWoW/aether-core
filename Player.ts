import { Socket } from 'socket.io';
import { Unit } from './Unit';
import { world } from './WorldManager';

export class Player extends Unit {
    public xp: number = 0;
    public level: number = 1
    private gcdTimer: number = 0;
    private _target: Unit | null = null;
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

    SetTargetByGuid(guid: string) {
        const target = world.units.get(guid);
        if (!target) {
            console.warn(`[PLAYER] Target not found. ERROR!`);
            return;
        }
        this._target = target;
        console.log(`[PLAYER] Player ${this.guid} set target to ${target.guid}`);
        //TODO: Send target update to client
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