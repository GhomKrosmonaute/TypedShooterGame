import Scene from '../Scene';
import App from '../../App';
export default class Manual extends Scene {
    private ignoreKeysRate;
    constructor(app: App);
    reset(): void;
    draw(): void;
    step(): void;
    keyPressed(key: string): void;
    private drawShortcuts;
    private drawDirectionKeys;
    private drawKeyWithNameIn;
    private drawKey;
}
