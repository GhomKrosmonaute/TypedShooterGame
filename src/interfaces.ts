
import Bonus from './Shooter/Bonus';
import p5 from 'p5';
import App from "./Shooter/App";
import Positionable from "./Shooter/Positionable";

interface BonusExtender extends Bonus {
    shape: ShapeFunction
}

export interface Consumable extends BonusExtender {
    quantity: number
    exec: () => void
}

export interface Passive extends BonusExtender {
    level: number
}

export interface TemporaryEffects {
    [key:string]: TemporaryEffect
}

export interface TemporaryEffect {
    shape: ShapeFunction
    triggerTime: number
    timeout: number
}

export interface GameAnimation {
    draw: ( app:App, time:number ) => void
    duration: number
}

export interface PuttedAnimation {
    animation: GameAnimation
    startTime: number
    endTime: number
}

export type ShapeFunction = (
    p:p5,
    x:number, y:number,
    w:number, h:number
) => void

export interface Keys {
    [key:string]: boolean
}

export enum MoveKeys {
    DOWN = 'ArrowDown',
    UP = 'ArrowUp',
    LEFT = 'ArrowLeft',
    RIGHT = 'ArrowRight'
}

export enum ShotKeys {
    DOWN = 's',
    UP = 'z',
    LEFT = 'q',
    RIGHT = 'd'
}

export const PowaKeys = '&é"\'(-è'.split('')

export type MoveKey = 'ArrowDown'|'ArrowUp'|'ArrowLeft'|'ArrowRight'
export type ShotKey = 's'|'z'|'q'|'d'
export type PowaKey = '&'|'é'|'"'|"'"|'('|'-'|'è'
