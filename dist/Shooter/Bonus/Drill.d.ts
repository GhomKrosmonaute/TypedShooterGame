import { Passive } from '../../interfaces';
import Bonus from '../Bonus';
import p5 from 'p5';
export default class Drill extends Bonus implements Passive {
    level: number;
    id: string;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
    applyEffect(): void;
}
