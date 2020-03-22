import Scene from '../Scene';
import Particles from '../Particles';
import App from '../../App';
import Rate from '../Rate';
import Animation from '../Animation';
export default class Manual extends Scene {
    animations: Animation[];
    rate: Rate;
    time: number;
    particles: Particles;
    private ignoreKeysTime;
    private readonly docImage;
    private readonly ignoreKeysInterval;
    constructor(app: App);
    reset(): void;
    draw(): void;
    step(): void;
    keyPressed(key: string): void;
    mousePressed(): any;
}
