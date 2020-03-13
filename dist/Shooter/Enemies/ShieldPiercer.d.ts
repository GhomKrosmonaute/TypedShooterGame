import Enemy from '../Enemy';
import App from '../App';
import Shot from "../Shot";
export default class ShieldPiercer extends Enemy {
    immune: boolean;
    damage: number;
    speed: number;
    gain: number;
    life: number;
    id: string;
    constructor(app: App);
    pattern(): void;
    onPlayerContact(): void;
    onShoot(shoot: Shot): boolean;
    onDraw(): void;
    readonly currentRadius: number;
}
