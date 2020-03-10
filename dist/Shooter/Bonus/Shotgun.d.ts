import Bonus from '../Bonus';
import { Passive } from '../../interfaces';
import p5 from 'p5';
export default class Shotgun extends Bonus implements Passive {
    level: number;
    id: string;
    applyEffect(): void;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
}
