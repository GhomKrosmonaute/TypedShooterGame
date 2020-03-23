import { AnimationOptions, Vector2D } from '../../interfaces';
import p5 from 'p5';
import Scene from './Scene';
export default class Animation {
    scene: Scene;
    readonly p: p5;
    readonly startTime: number;
    readonly endTime: number;
    readonly duration: number;
    position: Vector2D;
    value: any;
    className?: string;
    id?: string;
    attach: boolean;
    finish: boolean;
    private readonly onDraw;
    private readonly callback?;
    constructor(scene: Scene, options: AnimationOptions);
    draw(): void;
    step(): void;
    readonly time: number;
    readonly timeIsOut: boolean;
    move(x: number, y: number): void;
}
