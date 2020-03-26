import Enemy from '../Enemy';
import Shot from "../Shot";
import Party from '../Scenes/Party';
export default class Rocket extends Enemy {
    gain: number;
    life: number;
    speed: number;
    immune: boolean;
    damage: number;
    id: string;
    private rotation;
    private rotationSpeed;
    private readonly lockTime;
    private readonly damageTime;
    private damageZone;
    private damageOccured;
    constructor(party: Party);
    pattern(): void;
    onPlayerContact(): void;
    shotFilter(shoot: Shot): boolean;
    onDraw(): void;
}
