import Scene from '../Scene';
import App from '../../App';
import Rate from '../Rate';
import Animation from '../Animation';
export default class Profile extends Scene {
    animations: Animation[];
    rate: Rate;
    time: number;
    private form;
    constructor(app: App);
    reset(): void;
    draw(): void;
    step(): void;
    keyPressed(key: string): void;
    mousePressed(): void;
}
