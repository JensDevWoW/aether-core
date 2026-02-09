import { Socket } from 'socket.io';
import { Spell } from './Spell';
export class Unit {
    constructor(
        public guid: string,
        public name: string,
        public socket: Socket
    ) {}
    
    private _isPlayer: boolean = false;
    private _health: number = 1000;
    private _maxHealth: number = 1000;
    private _isCasting: boolean = false;

    private _spellList: Spell[] = [];

    AddSpellToList(spell: Spell) {
        this._spellList.push(spell);
    }
    GetTarget(): Unit | null {
        return null; // Placeholder implementation
    }

    SetCasting() {
        this._isCasting = true;
    }

    StopCasting() {
        this._isCasting = false;
    }

    IsPlayer(): boolean {
        return this._isPlayer;
    }

    GetHealth(): number {
        return this._health;
    }

    GetMaxHealth(): number {
        return this._maxHealth;
    }

    die() {
        this._health = 0;
        this.StopCasting();
        console.log(`[UNIT] Unit ${this.guid} has died.`);
    }

    SetIsPlayer() {
        this._isPlayer = true;
    }

    IsMoving() {
        return false; // Placeholder implementation
    }

    IsAlive() {
        return true; // Placeholder implementation
    }

    Update(dt: number){
        if (this._health <= 0){
            this.die();
        }

        // Update spells
        this._spellList.forEach((spell, index) => {
            spell.Update(dt);
            if (spell.IsFinished()) {
                this._spellList.splice(index, 1);
            }
        });

    }
}