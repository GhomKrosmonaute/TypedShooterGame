import createSpyObj = jasmine.createSpyObj;
import Bonus from './Shooter/Bonus';

export interface Consomable extends Bonus {
    quantity: number
    exec: () => void
}

export interface Passive extends Bonus {
    level: number
}

export interface TemporaryEffects {
    [key:string]: {
        shape: ShapeFunction
        triggerTime: number
        timeout: number
    }
}

export type ShapeFunction = (
    x:number, y:number, w:number, h:number
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
