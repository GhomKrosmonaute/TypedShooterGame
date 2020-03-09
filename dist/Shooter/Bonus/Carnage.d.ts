import Bonus from '../Bonus';
import { Consumable } from '../../interfaces';
import p5 from 'p5';
export default class Carnage extends Bonus implements Consumable {
    quantity: number;
    applyEffect(): void;
    exec(): void;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
}
