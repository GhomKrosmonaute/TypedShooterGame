import Positionable from './Positionable';
import App from '../App';
export default class Cursor extends Positionable {
    app: App;
    private readonly baseFadeOut;
    private fadeOut;
    mode: 'pointer' | 'default';
    constructor(app: App);
    private readonly auraDiameter;
    step(): void;
    draw(): void;
    mouseMoved(): void;
}
