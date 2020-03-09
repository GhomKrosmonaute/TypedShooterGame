import Positionable from './Positionable';
import App from './App';
import Shoot from './Shoot';
export default abstract class Enemy extends Positionable {
    app: App;
    protected baseGain: number;
    protected baseLife: number;
    protected baseSpeed: number;
    abstract gain: number;
    abstract life: number;
    abstract speed: number;
    abstract pattern(): void;
    protected constructor(app: App);
    step(): void;
    draw(): void;
    kill(addToScore?: boolean): void;
    shoot(shoot: Shoot): void;
    readonly currentRadius: number;
    reset(): void;
}
