import Enemy from '../Enemy';
import Shot from "../Shot";
import Party from '../Scenes/Party';
export default class CircularSaw extends Enemy {
    gain: number;
    life: number;
    speed: number;
    immune: boolean;
    damage: number;
    id: string;
    private lastDamage;
    private damageInterval;
    private rotation;
    private rotationSpeed;
    constructor(party: Party);
    pattern(): void;
    onPlayerContact(): void;
    shotFilter(shoot: Shot): boolean;
    onDraw(): void;
}
