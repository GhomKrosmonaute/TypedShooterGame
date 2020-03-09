import Bonus from '../Bonus';
import { Passive } from '../../interfaces';
import p5 from 'p5';
export default class Bazooka extends Bonus implements Passive {
    level: number;
    applyEffect(): void;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
}
