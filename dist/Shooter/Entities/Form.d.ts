import Zone from './Zone';
import { InputOptions } from '../../interfaces';
import Input from './Input';
import p5 from 'p5';
import App from '../App';
export default class Form extends Zone {
    app: App;
    inputs: Input[];
    p: p5;
    constructor(app: App, x1: number, y1: number, x2: number, y2: number, inputs: InputOptions[], toCenter?: boolean);
    draw(): void;
    keyPressed(key: string): void;
    mousePressed(): void;
    readonly focused: Input;
    readonly focus: boolean;
}
