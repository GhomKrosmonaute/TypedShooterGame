import {Vector2D} from '../../interfaces';

export default class Zone {

    constructor(
        public startX:number,
        public startY:number,
        public stopX:number,
        public stopY:number
    ) {}

    public get start(): Vector2D { return { x: this.startX, y: this.startY } }
    public get stop(): Vector2D { return { x: this.stopX, y: this.stopY } }
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

}