import { Passive } from '../../interfaces';
import Bonus from '../Bonus';
import p5 from 'p5';
export default class Falcon extends Bonus implements Passive {
    level: number;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
    applyEffect(): void;
}
