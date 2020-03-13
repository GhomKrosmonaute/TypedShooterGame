import Positionable from './Positionable';
import App from './App';
export default abstract class Bonus extends Positionable {
    app: App;
    private radiusVariation;
    abstract applyEffect(): void;
    abstract displayName: string;
    abstract description: string;
    abstract id: string;
    used: boolean;
    constructor(app: App);
    draw(): void;
    step(): void;
    use(): void;
}
