import Enemy from '../Enemy';
import Party from '../Scenes/Party';
import Shot from "../Shot";
export default class ShieldPiercer extends Enemy {
    immune: boolean;
    damage: number;
    speed: number;
    gain: number;
    life: number;
    id: string;
    constructor(party: Party);
    pattern(): void;
    onPlayerContact(): void;
    onShoot(shoot: Shot): boolean;
    onDraw(): void;
    readonly currentRadius: number;
}
