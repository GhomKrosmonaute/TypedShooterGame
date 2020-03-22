import Scene from '../Scene';
import App from '../../App';
import Rate from '../Rate';
import Animation from '../Animation';
export default class Scores extends Scene {
    animations: Animation[];
    rate: Rate;
    time: number;
    constructor(app: App);
    reset(): void;
    draw(): void;
    step(): void;
    keyPressed(key: string): void;
    mousePressed(): any;
}
