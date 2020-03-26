import p5 from 'p5';
import { Vector2D } from "../../interfaces";
export default class Positionable {
    p: p5;
    x: number;
    y: number;
    z: number;
    currentDiameter?: number;
    constructor(p: p5, x?: number, y?: number, z?: number);
    diameter: number;
    readonly radius: number;
    move(x: number, y: number, z?: number): void;
    place(x: number, y: number, z?: number): void;
    follow(target: Vector2D, speed: number): void;
    target(target: Vector2D, speedFraction: number): void;
    placeOutOfLimits(): void;
    placeOutOfViewport(withSecurity?: boolean): void;
    showIfNotOnScreen(): void;
    isOutOfLimits(): boolean;
    isOutOfViewPort(): boolean;
    isOnScreen(ignoreDiameter?: boolean): boolean;
    dist(positionable: Positionable): number;
    touch(positionable: Positionable): boolean;
    distVector(vector: Vector2D): number;
    touchVector(vector: Vector2D): boolean;
}
