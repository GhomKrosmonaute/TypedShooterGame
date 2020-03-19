
import Bonus from './Shooter/Entities/Bonus';
import p5 from 'p5';
import App from "./Shooter/App";
import Positionable from "./Shooter/Entities/Positionable";
import createSpyObj = jasmine.createSpyObj;
import Scene from './Shooter/Entities/Scene';

interface BonusExtender extends Bonus {
    shape: ShapeFunction
}

export interface Consumable extends BonusExtender {
    quantity: number
    exec: () => void
}

export interface Passive extends BonusExtender {
    value: number
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
    value: any
    duration: number
    draw: ( p:p5, time:number, values:any ) => void
}

export interface PuttedAnimation {
    id?: string
    animation: GameAnimation
    startTime: number
    endTime: number
}

export type Vector2D = Positionable | {x:number,y:number}

export type ShapeFunction = (
    p:p5,
    x:number, y:number,
    w:number, h:number
) => void

export interface Keys {
    [key:string]: boolean
}

export interface KeyMode {
    name: string
    shoot: DirectionalKeys
    move: DirectionalKeys
    numeric: string[][]
}

export interface DirectionalKeys {
    up: string[]
    down: string[]
    left: string[]
    right: string[]
}

export interface Scenes {
    [key:string]: Scene
}

export type SceneName = 'party' | 'pause'
