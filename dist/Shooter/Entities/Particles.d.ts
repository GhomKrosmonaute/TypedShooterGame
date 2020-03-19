import App from '../App';
import Positionable from './Positionable';
export default class Particles extends Positionable {
    app: App;
    private readonly particleCount;
    min: number;
    max: number;
    private children;
    constructor(app: App, particleCount: number, min: number, max: number);
    move(x: number, y: number): void;
    step(): void;
    draw(): void;
}
