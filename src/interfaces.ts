
import Bonus from './Shooter/Entities/Bonus';
import p5 from 'p5';
import App from "./Shooter/App";
import Positionable from "./Shooter/Entities/Positionable";
import createSpyObj = jasmine.createSpyObj;
import Scene from './Shooter/Entities/Scene';
import Input from './Shooter/Entities/Input';
import Animation from './Shooter/Entities/Animation';
import Color from './Shooter/Entities/Color';

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

export interface PopupOptions {
    value:any
    position?:Vector2D
    attach?:boolean
    id?:string
    callback?:AnimationCallback
}

export interface AnimationMinimalOptions extends PopupOptions {
    className:AnimationClass
    duration:number
}

export interface AnimationOptions extends AnimationMinimalOptions {
    draw: AnimationCallback
}

export type AnimationClass = 'popup' | 'high' | 'low'

export type AnimationCallback = ( animation:Animation ) => void

export type Vector2D = Positionable | {x:number,y:number}

export type ShapeFunction = (
    p:p5,
    x:number, y:number,
    w:number, h:number
) => void

export interface Keys {
    [key:string]: boolean
}

export interface Touch {
    active: boolean
    base: Vector2D
    current: Vector2D
}

export interface KeyMode {
    name: string
    shoot: DirectionalKeys
    move: DirectionalKeys
    numeric: string[][]
    shortcuts: {
        lightMode: string[]
        keyMode: string[]
        profile: string[]
        scores: string[]
        party: string[]
        manual: string[]
        gamepad: string[]
    }
}

export interface DirectionalKeys {
    up: string[]
    down: string[]
    left: string[]
    right: string[]
}

export type SceneName = 'party' | 'manual' | 'scores' | 'profile'

export interface InputOptions {
    placeholder:string
    value?:string
    hide?:boolean
    focus?:boolean
    required?:boolean
}

export interface LinkOptions {
    targetName:SceneName
    resetNew?:boolean
    resetOld?:boolean
    text?:string
}

export interface Palette {
    blue:Color
    red:Color
}

export type ColorResolvable = RGB | p5.Color | string | Color
export type RGB = [number,number,number]

export interface PartyResult {
    score:number
    duration:number
    kills:number
    precision:number
}

export type LeaderBoard = PlayerRank[]

export interface PlayerRank {
    username: string
    score: number
    precision: number
    kills: number
    duration: number
}

export interface User {
    username: string
    password: string
    id: number
}

export interface Images {
    [key:string]: p5.Image
}

export interface Fonts {
    [key:string]: p5.Font
}
