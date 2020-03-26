import {Vector2D} from '../../interfaces';
import p5 from 'p5';

export default class Zone {

    public startX:number
    public startY:number
    public stopX:number
    public stopY:number

    constructor(
        public x1:number,
        public y1:number,
        public x2:number,
        public y2:number,
        public toCenter:boolean = false
    ) {
        this.startX = toCenter ? x1 - x2 * .5 : x1
        this.startY = toCenter ? y1 - y2 * .5 : y1
        this.stopX = toCenter ? x1 + x2 * .5 : x2
        this.stopY = toCenter ? y1 + y2 * .5 : y2
    }

    public get start(): Vector2D { return { x: this.startX, y: this.startY } }
    public get stop(): Vector2D { return { x: this.stopX, y: this.stopY } }
    public get leftBottom(): Vector2D { return { x: this.startX, y: this.stopY } }
    public get rightUp(): Vector2D { return { x: this.stopX, y: this.startY } }
    public get width(): number { return this.stopX - this.startX }
    public get height(): number { return this.stopY - this.startY }
    public get center(): Vector2D { return this.fraction(.5,.5) }

    public move( x:number, y:number ): void {
        this.startX += x
        this.startY += y
        this.stopX += x
        this.stopY += y
    }

    public fraction(
        proportionX:number,
        proportionY:number,
        size:boolean = false
    ): Vector2D {
        return {
            x: this.fractionX(proportionX,size),
            y: this.fractionY(proportionY,size)
        }
    }
    public fractionX( proportion:number, size:boolean = false ): number {
        return (size ? 0 : this.startX) + this.width * proportion
    }
    public fractionY( proportion:number, size:boolean = false ): number {
        return (size ? 0 : this.startY) + this.height * proportion
    }
    public fractionWidth( proportion:number ): number {
        return this.fractionX(proportion,true)
    }
    public fractionHeight( proportion:number ): number {
        return this.fractionY(proportion,true)
    }

    public touchVector( point:Vector2D ): boolean {
        return (
            (point.x > this.start.x && point.x < this.stop.x) &&
            (point.y > this.start.y && point.y < this.stop.y)
        )
    }

    public touchZone( zone:Zone ): boolean {
        return (
            this.touchVector(zone.start) ||
            this.touchVector(zone.stop) ||
            this.touchVector(zone.leftBottom) ||
            this.touchVector(zone.rightUp) ||
            zone.touchVector(this.start) ||
            zone.touchVector(this.stop) ||
            zone.touchVector(this.leftBottom) ||
            zone.touchVector(this.rightUp)
        )
    }

    public debug( p:p5 ): void {
        p.noFill()
        p.stroke(255,0,0)
        p.strokeWeight(1)
        p.rect(
            this.start.x,
            this.start.y,
            this.width,
            this.height
        )
    }

}