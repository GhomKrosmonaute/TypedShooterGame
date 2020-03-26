import Enemy from '../Enemy';
import Shot from "../Shot";
import Party from '../Scenes/Party';
export default class BlobMob extends Enemy {
    immune: boolean;
    speed: number;
    damage: number;
    gain: number;
    life: number;
    maxLife: number;
    id: string;
    constructor(party: Party);
    pattern(): void;
    absorb(enemy: Enemy): void;
    onPlayerContact(): void;
    shotFilter(shoot: Shot): boolean;
    onDraw(): void;
    readonly currentDiameter: number;
}
