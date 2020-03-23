import p5 from 'p5';
import Bonus from './Shooter/Entities/Bonus';
import Enemy from './Shooter/Entities/Enemy';
import Party from './Shooter/Entities/Scenes/Party';
export declare function fade(p: p5, fadeMax: number, fadeIn: {
    value: number;
    valueMax: number;
    fadeMax?: number;
    overflow: number;
}, fadeOut?: {
    value: number;
    valueMax: number;
    fadeMax?: number;
    overflow: number;
}): number;
export declare function seconds(nbr: number): number;
export declare function minutes(nbr: number): number;
export declare function pick<T>(list: T[]): T;
export declare function pickEnemy(party: Party): Enemy;
export declare function pickBonus(party: Party): Bonus;
export declare function getInput(id: string): HTMLInputElement;
