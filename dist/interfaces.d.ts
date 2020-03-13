import Bonus from './Shooter/Bonus';
import p5 from 'p5';
import Positionable from "./Shooter/Positionable";
interface BonusExtender extends Bonus {
    shape: ShapeFunction;
}
export interface Consumable extends BonusExtender {
    quantity: number;
    exec: () => void;
}
export interface Passive extends BonusExtender {
    value: number;
    level: number;
}
export interface TemporaryEffects {
    [key: string]: TemporaryEffect;
}
export interface TemporaryEffect {
    shape: ShapeFunction;
    triggerTime: number;
    timeout: number;
}
export interface GameAnimation {
    value: any;
    duration: number;
    draw: (p: p5, time: number, values: any) => void;
}
export interface PuttedAnimation {
    id?: string;
    animation: GameAnimation;
    startTime: number;
    endTime: number;
}
export declare type Vector2D = Positionable | {
    x: number;
    y: number;
};
export declare type ShapeFunction = (p: p5, x: number, y: number, w: number, h: number) => void;
export interface Keys {
    [key: string]: boolean;
}
export interface KeyMode {
    name: string;
    shoot: DirectionalKeys;
    move: DirectionalKeys;
    numeric: string[][];
}
export interface DirectionalKeys {
    up: string[];
    down: string[];
    left: string[];
    right: string[];
}
export declare const LIMITS = 3000;
export declare const VIEWPORT = 1000;
export declare const SECURITY = 1000;
export {};
