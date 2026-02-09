import { Unit } from './Unit';
import { Player } from './Player';
import { io } from './SocketManager';
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
    private m_timer: number = 1.5;
    private m_initialSpellTime: number = 0;
    private m_spellTime: number = 1;
    prepare() {
        if (this.isPreparing) return;
        console.log(`[SPELL] Spell ${this.spellId} is being prepared by Unit ${this.caster.guid}`);
        
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
                this.HandleFailedCast(cancast);
                return;
            }

            this.caster.SetCasting();
            this.m_spellState = SpellState.PREPARING;
            this.SendSpellStartPacket();
        }
    }

    private SendSpellStartPacket() {
        if (this.caster == null || this.caster.socket == null) {
            console.warn("[SPELL] Cannot send spell start packet: Caster or caster socket is null");
            return;
        }
        console.log(`[SPELL] Sending spell start packet for Spell ${this.spellId} cast by Unit ${this.caster.guid}`);
        const payload = {
            opcode: "SMSG_SPELL_START",
            data: {
                casterId: this.caster.guid,
                targetId: this.target ? this.target.guid : null,
                spellId: this.spellId,
                timer: 1500, // Placeholder cast time in ms
                gcd: this.caster.IsPlayer() ? (this.caster as Player).IsOnGCD() : 1500,
                animation: true, // Placeholder for whether to play cast animation
                isQueued: false, // Placeholder for whether this spell is queued behind another
                // position: { x: this.caster.x, y: this.caster.y }, // Placeholder for caster position
                voc: false, // Placeholder for visual on cast
            }
        }

        io.emit('SMSG_PACKET', payload);

    }

    private SendSpellGoPacket() {
        if (this.caster == null || this.caster.socket == null) {
            console.warn("[SPELL] Cannot send spell GO packet: Caster or caster socket is null");
            return;
        }
        console.log(`[SPELL] Sending spell GO packet for Spell ${this.spellId} cast by Unit ${this.caster.guid}`);
        const payload = {
            opcode: "SMSG_SPELL_GO",
            data: {
                casterId: this.caster.guid,
                targetId: this.target ? this.target.guid : null,
                spellId: this.spellId,
                timer: 1500, // Placeholder cast time in ms
                gcd: this.caster.IsPlayer() ? (this.caster as Player).IsOnGCD() : 1500,
                animation: true, // Placeholder for whether to play cast animation
                isQueued: false, // Placeholder for whether this spell is queued behind another
                // position: { x: this.caster.x, y: this.caster.y }, // Placeholder for caster position
                voc: false, // Placeholder for visual on cast
            }
        }

        io.emit('SMSG_PACKET', payload);
    }

    IsFinished() {
        return this.m_spellState === SpellState.NONE;
    }

    private HandleFailedCast(reason: string) {
        // Placeholder implementation
        // In a real implementation, this would send a failure message to the client with the reason
        console.warn(`[SPELL] Cast failed: ${reason}`);
    }

    CheckCast(): string {
        if (!this.caster) return "No caster";
        if (this.caster.IsPlayer() && (this.caster as Player).IsOnGCD()) return "gcd";
        // Placeholder implementation
        // In a real implementation, this would check mana, cooldowns, range, etc.
        return ""; // Return empty string if cast is valid, otherwise return reason
    }

    SetFinished() {
        console.log(`[SPELL] Spell ${this.spellId} cast by Unit ${this.caster.guid} has finished.`);
        this.m_spellState = SpellState.NONE;
        this.caster.StopCasting();
        // Send spell finish packet to clients if needed
    }

    Cancel() {
        console.log(`[SPELL] Spell ${this.spellId} cast by Unit ${this.caster.guid} has been cancelled.`);
        this.m_spellState = SpellState.NONE;
        this.caster.StopCasting();
        // Send cancel packet to clients if needed
    }

    Execute() {
        // check if needs target

        // Check if caster is alive

        this.SendSpellGoPacket();
        
        this.m_spellState = SpellState.CASTING;

        // this.HandleEffects();
        // Handle spell effects and damage application here
    }

    Cast() {
        if (!this.caster) {
            return;
        }

        this.Execute();
    }

    Update(dt: number) {
        if (this.m_timer > 0 && this.caster.IsMoving())
            this.Cancel();

        switch (this.m_spellState) {
            case SpellState.PREPARING:
                const shouldCancel = !this.caster.IsAlive() //||
                    //(this.caster.IsMoving() && !this.HasFlag(SpellFlags.CAST_WHILE_MOVING);
                if (shouldCancel) {
                    this.Cancel();
                    break;
                }
                if (this.m_timer > 0) {
                    this.m_timer -= dt;
                } else {
                    this.Cast();
                }
                break;
            case SpellState.CASTING:
                // Handle channeling or instant cast completion here
                break;
            case SpellState.DELAYED:
                const target = this.target;
                if (target != null) {
                    // Handle spell travel time here
                }
                this.m_spellTime -= dt;
                break;
            case SpellState.QUEUED:
                // Handle queued spell logic here
                break;
            case SpellState.FINISHED:
                this.m_spellTime = 0;
                // OnHit() logic
                // HandleEffects() logic
                this.m_spellState = SpellState.NONE;
                this.SetFinished();
                break;
            case SpellState.NONE:
                break;
        }
    }
}