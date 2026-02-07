import { Socket } from 'socket.io';
import { Unit } from './Unit';
// import { SpellInfo } from './SpellInfo';

export enum SpellState {
    NONE = 0,
    PREPARING = 1,
    DELAYED,
    FINISHED,
    CASTING,
    QUEUED,
}

export class Spell {
    public target: Unit | null;
    constructor(
        public spellId: number,
        public caster: Unit,
    ) {
        this.target = this.caster.GetTarget();
    }
    private isPreparing: boolean = false;
    private m_spellState: SpellState = SpellState.NONE;

    prepare() {
        if (this.isPreparing) return;
        console.log(`[SPELL] Spell ${this.spellId} is being prepared by Unit ${this.caster.id}`);
        
        // NeedsTarget calculation here
        if (this.caster) {
            this.isPreparing = true;

            // SpellScript mods

            // Check if spell has been learned so no hax

            const cancast = this.CheckCast();
            if (cancast != "")
            {
                console.log(`[SPELL] Spell ${this.spellId} cannot be cast: ${cancast}`);
                this.isPreparing = false;
                return;
            }

            this.caster.SetCasting();
            this.m_spellState = SpellState.PREPARING;
            
        }
    }

    CheckCast(): string {
        // Placeholder implementation
        // In a real implementation, this would check mana, cooldowns, range, etc.
        return ""; // Return empty string if cast is valid, otherwise return reason
    }
}