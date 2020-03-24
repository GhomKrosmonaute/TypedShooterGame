import { Vector2D } from '../../interfaces';
export default class Zone {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    toCenter: boolean;
    startX: number;
    startY: number;
    stopX: number;
    stopY: number;
    constructor(x1: number, y1: number, x2: number, y2: number, toCenter?: boolean);
    readonly start: Vector2D;
    readonly stop: Vector2D;
    readonly leftBottom: Vector2D;
    readonly rightUp: Vector2D;
    readonly width: number;
    readonly height: number;
    readonly center: Vector2D;
    move(x: number, y: number): void;
    fraction(proportionX: number, proportionY: number, size?: boolean): Vector2D;
    fractionX(proportion: number, size?: boolean): number;
    fractionY(proportion: number, size?: boolean): number;
    touchVector(point: Vector2D): boolean;
    touchZone(zone: Zone): boolean;
}
