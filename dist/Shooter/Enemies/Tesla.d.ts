import Enemy from '../Enemy';
import App from '../App';
import Shot from "../Shot";
import { Vector2D } from "../../interfaces";
export default class Tesla extends Enemy {
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
    connections: Tesla[];
    constructor(app: App);
    pattern(): void;
    onPlayerContact(): void;
    kill(addToScore?: boolean): void;
    onShoot(shoot: Shot): boolean;
    onDraw(): void;
    arc(tesla: Tesla): void;
    isOnArc(tesla: Tesla, target: Vector2D | false): boolean;
    readonly currentRadius: number;
}
