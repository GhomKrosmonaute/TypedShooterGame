import p5 from 'p5';
export default class Positionable {
    p: p5;
    x: number;
    y: number;
    z: number;
    constructor(p: p5, x?: number, y?: number, z?: number);
    radius: number;
    move(x: number, y: number, z?: number): void;
    place(x: number, y: number, z?: number): void;
    follow(positionable: Positionable, speed: number): void;
    placeOutOfLimits(): void;
    isOutOfLimits(): boolean;
    isOnScreen(ignoreRadius?: boolean): boolean;
    dist(positionable: Positionable): number;
}
