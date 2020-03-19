import p5 from 'p5';
import { Vector2D } from "../../interfaces";
export default class Positionable {
    p: p5;
    x: number;
    y: number;
    z: number;
    constructor(p: p5, x?: number, y?: number, z?: number);
    radius: number;
    move(x: number, y: number, z?: number): void;
    place(x: number, y: number, z?: number): void;
    follow(positionable: Vector2D, speed: number): void;
    placeOutOfLimits(): void;
    placeOutOfViewport(withSecurity?: boolean): void;
    showIfNotOnScreen(): void;
    isOutOfLimits(): boolean;
    isOutOfViewPort(): boolean;
    isOnScreen(ignoreRadius?: boolean): boolean;
    dist(positionable: Vector2D): number;
}
