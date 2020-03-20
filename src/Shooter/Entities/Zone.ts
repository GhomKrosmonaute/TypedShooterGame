import {Vector2D} from '../../interfaces';

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

    public fraction(
        proportionX:number,
        proportionY:number
    ): Vector2D {
        if(proportionX > 1) proportionX /= 100
        if(proportionY > 1) proportionY /= 100
        return {
            x: this.startX + this.width * proportionX,
            y: this.startY + this.height * proportionY
        }
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

}