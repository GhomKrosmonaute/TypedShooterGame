import Enemy from '../Enemy';
import App from '../App';
import Shot from "../Shot";
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
    constructor(app: App);
    pattern(): void;
    onPlayerContact(): void;
    onShoot(shoot: Shot): boolean;
    onDraw(): void;
}
