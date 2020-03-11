import Enemy from '../Enemy';
import App from '../App';
import Shoot from "../Shoot";
export default class MineEnemy extends Enemy {
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
    constructor(app: App);
    pattern(): void;
    onPlayerContact(): void;
    onShoot(shoot: Shoot): boolean;
    onDraw(): void;
}
