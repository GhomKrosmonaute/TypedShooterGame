import Enemy from '../Enemy';
import App from '../App';
import Shoot from "../Shoot";
import { Vector2D } from "../../interfaces";
export default class TeslaEnemy extends Enemy {
    immune: boolean;
    speed: number;
    damage: number;
    gain: number;
    life: number;
    arcInterval: number;
    id: string;
    arcSize: number;
    arcWeight: number;
    arcTime: number;
    cardinalIndex: number;
    connections: TeslaEnemy[];
    constructor(app: App);
    pattern(): void;
    onPlayerContact(): void;
    kill(addToScore?: boolean): void;
    onShoot(shoot: Shoot): boolean;
    onDraw(): void;
    arc(tesla: TeslaEnemy): void;
    isOnArc(tesla: TeslaEnemy, target: Vector2D | false): boolean;
    readonly currentRadius: number;
}
