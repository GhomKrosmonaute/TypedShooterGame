import Scene from '../Scene';
import App from '../../App';
export default class Profile extends Scene {
    constructor(app: App);
    reset(): void;
    draw(): void;
    step(): void;
    keyPressed(key: string): void;
}
