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
    class?: string;
    id?: string;
    private readonly onDraw;
    constructor(scene: Scene, options: AnimationOptions);
    draw(): void;
    readonly time: number;
    readonly timeIsOut: boolean;
    move(x: number, y: number): void;
}
