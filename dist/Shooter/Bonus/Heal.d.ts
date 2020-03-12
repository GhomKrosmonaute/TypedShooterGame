import Bonus from '../Bonus';
import { Consumable } from '../../interfaces';
import p5 from 'p5';
export default class Heal extends Bonus implements Consumable {
    quantity: number;
    id: string;
    displayName: string;
    description: string;
    exec(): void;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
    applyEffect(): void;
}
