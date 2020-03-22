import Bonus from '../Bonus';
import { Passive } from '../../../interfaces';
import p5 from 'p5';
export default class SpeedUp extends Bonus implements Passive {
    level: number;
    levelMax: number;
    id: string;
    displayName: string;
    description: string;
    applyEffect(): void;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
    readonly value: number;
}
