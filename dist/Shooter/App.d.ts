import p5 from 'p5';
import { AnimationOptions, KeyMode, Keys, SceneName, Vector2D } from '../interfaces';
import Rate from './Entities/Rate';
import Scene from './Entities/Scene';
import API from './API';
import Animation from './Entities/Animation';
export default class App {
    p: p5;
    api: API;
    private readonly cursorImage;
    private readonly baseCursorFadeOut;
    _sceneName: SceneName;
    private readonly scenes;
    readonly version = "0.1.4";
    readonly debug = false;
    private fullscreen;
    private cursorFadeOut;
    keys: Keys;
    rate: Rate;
    darkModeTransition: number;
    keyModes: KeyMode[];
    animations: Animation[];
    constructor(p: p5, api: API);
    reset(): void;
    step(): Promise<void>;
    draw(): Promise<void>;
    readonly scene: Scene;
    sceneName: SceneName;
    readonly mouse: Vector2D;
    setAnimation(options: AnimationOptions): void;
    setPopup(text: string): void;
    switchDarkMode(): void;
    switchKeyMode(): void;
    readonly keyMode: KeyMode;
    keyIsPressed(type: 'move' | 'shoot', direction: 'up' | 'down' | 'left' | 'right'): boolean;
    keyModeIndex: number;
    darkMode: boolean;
    readonly dark: number;
    readonly light: number;
    mouseMoved(): void;
    keyReleased(key: string): void;
    keyPressed(key: string): void;
    mousePressed(): void;
    moveKeyIsPressed(): boolean;
    shootKeyIsPressed(): boolean;
    private directionalKeyIsPressed;
    areOnContact(positionable1: any, positionable2: any): boolean;
}
