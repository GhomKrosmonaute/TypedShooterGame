import p5 from 'p5';
import { GameAnimation, Keys, PuttedAnimation } from '../interfaces';
import Particles from './Particles';
import Enemy from './Enemy';
import Player from './Player';
import Bonus from './Bonus';
import Rate from './Rate';
export default class App {
    p: p5;
    private readonly docImage;
    private readonly baseDocFadeOut;
    private readonly maxEnemyCount;
    private readonly minEnemyCount;
    readonly version = "0.1.2";
    readonly debug = false;
    private showDoc;
    private docFadeOut;
    keys: Keys;
    player: Player;
    rate: Rate;
    background: Particles;
    foreground: Particles;
    particles: Particles;
    animations: PuttedAnimation[];
    enemies: Enemy[];
    bonus: Bonus[];
    bonusState: number;
    lastBonusState: number;
    darkModeTransition: number;
    constructor(p: p5);
    reset(): void;
    move(x: number, y: number): void;
    step(): void;
    draw(): void;
    darkMode: boolean;
    readonly dark: number;
    readonly light: number;
    setAnimation(animation: GameAnimation): void;
    keyReleased(key: string): void;
    keyPressed(key: string): void;
    moveKeysIsNotPressed(): boolean;
    shootKeysIsNotPressed(): boolean;
    areOnContact(positionable1: any, positionable2: any): boolean;
    readonly enemyCount: number;
}
