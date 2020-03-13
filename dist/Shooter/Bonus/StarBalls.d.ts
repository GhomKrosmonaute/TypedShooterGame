import Bonus from '../Bonus';
import { Consumable } from '../../interfaces';
import p5 from 'p5';
export default class StarBalls extends Bonus implements Consumable {
    quantity: number;
    id: string;
    displayName: string;
    description: string;
    applyEffect(): void;
    exec(): void;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
}
