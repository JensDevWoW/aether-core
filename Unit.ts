import { Socket } from 'socket.io';

export class Unit {
    constructor(
        public id: number,
        public name: string,
        public socket: Socket
    ) {}
    
    
    private _health: number = 1000;
    private _maxHealth: number = 1000;
    private _isCasting: boolean = false;
    GetTarget(): Unit | null {
        return null; // Placeholder implementation
    }

    SetCasting() {
        this._isCasting = true;
    }

    StopCasting() {
        this._isCasting = false;
    }
}