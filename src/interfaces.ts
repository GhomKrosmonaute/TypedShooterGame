
import Bonus from './Shooter/Entities/Bonus';
import p5 from 'p5';
import App from "./Shooter/App";
import Positionable from "./Shooter/Entities/Positionable";
import createSpyObj = jasmine.createSpyObj;
import Scene from './Shooter/Entities/Scene';
import Input from './Shooter/Entities/Input';
import Animation from './Shooter/Entities/Animation';

interface BonusExtender extends Bonus {
    shape: ShapeFunction
}

export interface Consumable extends BonusExtender {
    quantity: number
    exec: () => void
}

export interface Passive extends BonusExtender {
    value: number
    levelMax: number
    level: number
}

export interface Combo {
    hits:number
    time:number
    multiplicator:number
}

export interface TemporaryEffects {
    [key:string]: TemporaryEffect
}

export interface TemporaryEffect {
    shape: ShapeFunction
    triggerTime: number
    timeout: number
}

export interface AnimationOptions {
    id?:string
    className?:string
    position?:Vector2D
    attach?:boolean
    value:any
    duration:number
    draw: ( animation:Animation ) => void
    callback?:( animation:Animation ) => void
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

export type SceneName = 'party' | 'manual' | 'scores' | 'profile'

export interface InputOptions {
    placeholder:string
    value?:string
    hide?:boolean
    focus?:boolean
}
