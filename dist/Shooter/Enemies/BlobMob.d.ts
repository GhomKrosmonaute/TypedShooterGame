import Enemy from '../Enemy';
import App from '../App';
import Shot from "../Shot";
export default class BlobMob extends Enemy {
    immune: boolean;
    speed: number;
    damage: number;
    gain: number;
    life: number;
    maxLife: number;
    id: string;
    constructor(app: App);
    pattern(): void;
    absorb(enemy: Enemy): void;
    onPlayerContact(): void;
    onShoot(shoot: Shot): boolean;
    onDraw(): void;
    readonly currentRadius: number;
}
