import p5 from 'p5'
import {Vector2D} from "../../interfaces"
import {LIMITS,SECURITY,VIEWPORT} from '../../config'
import {constrain, dist, map, random} from '../../utils'
import Zone from './Zone';

export default class Positionable {

    public currentDiameter?:number

    constructor(
        public p:p5,
        public x:number = 0,
        public y:number = 0,
        public _diameter:number = 0
    ){}

    public get diameter(): number { return this.currentDiameter || this._diameter }
    public set diameter( diameter:number ){ this._diameter = diameter }

    public get radius(): number {
        return this.diameter * .5
    }

    public move( x:number, y:number ): void {
        this.x += x
        this.y += y
    }

    public scroll( x:number, y:number ): void {
        this.move(x,y)
    }

    public place( vector:Vector2D ): void {
        this.x = vector.x
        this.y = vector.y
    }

    public placeOutOfLimits(): void {
        this.x = LIMITS * 2
        this.y = LIMITS * 2
    }

    public placeOutOfViewport( withSecurity:boolean = false ): void {
        this.x = 0
        this.y = 0
        while(!this.isOutOfViewPort()){
            if(withSecurity){
                this.x = random( -LIMITS + SECURITY, LIMITS - SECURITY )
                this.y = random( -LIMITS + SECURITY, LIMITS - SECURITY )
            }else{
                this.x = random( -LIMITS, LIMITS )
                this.y = random( -LIMITS, LIMITS )
            }
        }
    }

    public constrain( zone?:Zone ): Vector2D {
        if(zone) return {
            x: constrain(this.x,zone.start.x,zone.stop.x),
            y: constrain(this.y,zone.start.y,zone.stop.y)
        }
        return {
            x: constrain(this.x,this.p.width * -.5,this.p.width * .5),
            y: constrain(this.y,this.p.height * -.5,this.p.height * .5),
        }
    }

    public isOutOfLimits(): boolean {
        return this.rawDist() > LIMITS
    }

    public isOutOfViewPort(): boolean {
        return this.rawDist() > VIEWPORT
    }

    public isOnScreen( ignoreRadius:boolean = false ): boolean {
        const radius = ignoreRadius ? 0 : this.radius
        return (
            this.x + radius > this.p.width * -.5 &&
            this.x - radius < this.p.width * .5 &&
            this.y + radius > this.p.height * -.5 &&
            this.y - radius < this.p.height * .5
        )
    }

    public calculatedDist( positionable:Positionable ): number {
        return this.rawDist(positionable) - (this.radius + positionable.radius)
    }

    public calculatedTouch( positionable:Positionable ): boolean {
        return this.calculatedDist(positionable) <= 0
    }

    public rawDist( vector:Vector2D = {x:0,y:0} ): number {
        return dist(vector.x, vector.y, this.x, this.y)
    }

    public rawTouch( vector:Vector2D = {x:0,y:0} ): boolean {
        return this.rawDist(vector) <= this.radius
    }

    public getVector(): Vector2D {
        return {
            x: this.x,
            y: this.y
        }
    }

}
