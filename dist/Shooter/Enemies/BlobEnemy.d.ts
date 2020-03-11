import Enemy from '../Enemy';
import App from '../App';
import Shoot from "../Shoot";
export default class BlobEnemy extends Enemy {
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
    onShoot(shoot: Shoot): boolean;
    onDraw(): void;
    readonly currentRadius: number;
}
