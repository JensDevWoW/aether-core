import { Socket } from 'socket.io';
import { Spell } from './Spell';
export class Unit {
    constructor(
        public guid: string,
        public name: string,
        public socket: Socket | null
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

    IsHostileTo(_other: Unit) {
        return false; // Placeholder implementation
    }

    Update(dt: number){
        if (this._health <= 0){
            this.die();
        }

        // Update spells
        for (let i = this._spellList.length - 1; i >= 0; i--) {
            const spell = this._spellList[i];
            spell.Update(dt);
            if (spell.IsFinished()) {
                this._spellList.splice(i, 1);
            }
        }

    }
}
