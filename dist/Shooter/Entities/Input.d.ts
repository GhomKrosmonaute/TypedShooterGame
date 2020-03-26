import Zone from './Zone';
import p5 from 'p5';
import { InputOptions } from '../../interfaces';
import App from '../App';
export default class Input extends Zone {
    app: App;
    hide: boolean;
    placeholder: string;
    value: string;
    focus: boolean;
    required: boolean;
    p: p5;
    constructor(app: App, x1: number, y1: number, x2: number, y2: number, toCenter: boolean, options: InputOptions);
    draw(): void;
    keyPressed(key: string): void;
}
