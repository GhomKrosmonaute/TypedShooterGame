import Positionable from './Positionable';
import App from './App';
export default abstract class Bonus extends Positionable {
    app: App;
    private radiusVariation;
    abstract applyEffect(): void;
    abstract id: string;
    constructor(app: App);
    draw(): void;
    step(): void;
}
