import Positionable from './Positionable';
import App from './App';
import Shoot from './Shoot';
export default abstract class Enemy extends Positionable {
    app: App;
    protected readonly MIN_RADIUS = 15;
    protected baseGain: number;
    protected baseLife: number;
    protected baseSpeed: number;
    protected baseDamage: number;
    abstract gain: number;
    abstract life: number;
    abstract speed: number;
    abstract damage: number;
    abstract immune: boolean;
    abstract id: string;
    abstract pattern(): void;
    abstract onDraw(): void;
    abstract onShoot(shoot: Shoot): boolean;
    abstract onPlayerContact(): void;
    protected constructor(app: App);
    step(): void;
    draw(): void;
    kill(addToScore?: boolean): void;
    shoot(shoot: Shoot): void;
    reset(): void;
}
