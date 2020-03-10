import Bonus from './Shooter/Bonus';
import p5 from 'p5';
import App from "./Shooter/App";
interface BonusExtender extends Bonus {
    shape: ShapeFunction;
}
export interface Consumable extends BonusExtender {
    quantity: number;
    exec: () => void;
}
export interface Passive extends BonusExtender {
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
    draw: (app: App, time: number) => void;
    duration: number;
}
export interface PuttedAnimation {
    animation: GameAnimation;
    startTime: number;
    endTime: number;
}
export declare type ShapeFunction = (p: p5, x: number, y: number, w: number, h: number) => void;
export interface Keys {
    [key: string]: boolean;
}
export declare enum MoveKeys {
    DOWN = "ArrowDown",
    UP = "ArrowUp",
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight"
}
export declare enum ShotKeys {
    DOWN = "s",
    UP = "z",
    LEFT = "q",
    RIGHT = "d"
}
export declare const PowaKeys: string[];
export declare type MoveKey = 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight';
export declare type ShotKey = 's' | 'z' | 'q' | 'd';
export declare type PowaKey = '&' | 'é' | '"' | "'" | '(' | '-' | 'è';
export {};
