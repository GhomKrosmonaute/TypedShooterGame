import Scene from '../Scene';
import Particles from '../Particles';
import App from '../../App';
export default class PauseScene extends Scene {
    particles: Particles;
    private ignoreKeysTime;
    private readonly docImage;
    private readonly ignoreKeysInterval;
    constructor(app: App);
    reset(): void;
    draw(): void;
    step(): void;
    keyPressed(key: string): void;
}
