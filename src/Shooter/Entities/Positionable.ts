import p5 from 'p5';
import {Vector2D} from "../../interfaces";
import {LIMITS,SECURITY,VIEWPORT} from '../../config'

export default class Positionable {

    public currentDiameter?:number

    constructor(
        public p:p5,
        public x:number = 0,
        public y:number = 0,
        public z:number = 0
    ){}

    public get diameter(): number { return this.currentDiameter || this.z }
    public set diameter(z ){ this.z = z }

    public get radius(): number {
        return (this.currentDiameter || this.diameter) * .5
    }

    public move( x:number, y:number, z:number = 0 ): void {
        this.x += x
        this.y += y
        this.z += z
    }

    public place( x:number, y:number, z:number = this.z ): void {
        this.x = x
        this.y = y
        this.z = z
    }

    public follow( target:Vector2D, speed:number ): void {
        if(this.distVector(target) <= speed * 2) return
        this.p.angleMode(this.p.RADIANS)
        const angle = this.p.degrees(
            this.p.atan2(
                target.y - this.y,
                target.x - this.x
            ) + this.p.PI
        )
        const speedX = speed * this.p.cos(this.p.radians(angle))
        const speedY = speed * this.p.sin(this.p.radians(angle))
        this.move(
            speedX * -2,
            speedY * -2
        )
        this.p.angleMode(this.p.DEGREES)
    }

    public target( target:Vector2D, speedFraction:number ): void {
        if(this.distVector(target) > 5)
            this.move(
                (target.x - this.x) * speedFraction,
                (target.y - this.y) * speedFraction
            )
    }

    public placeOutOfLimits(): void {
        this.x = LIMITS * 2
        this.y = LIMITS * 2
    }

    public placeOutOfViewport( withSecurity:boolean = false ): void {
        while(!this.isOutOfViewPort()){
            if(withSecurity){
                this.x = this.p.random( -LIMITS + SECURITY, LIMITS - SECURITY )
                this.y = this.p.random( -LIMITS + SECURITY, LIMITS - SECURITY )
            }else{
                this.x = this.p.random( -LIMITS, LIMITS )
                this.y = this.p.random( -LIMITS, LIMITS )
            }
        }
    }

    public showIfNotOnScreen(){
        if(!this.isOnScreen()){
            this.p.ellipse(
                this.x > this.p.width * .5 ? this.p.width * .5 : this.x < this.p.width * -.5 ? this.p.width * -.5 : this.x,
                this.y > this.p.height * .5 ? this.p.height * .5 : this.y < this.p.height * -.5 ? this.p.height * -.5 : this.y,
                this.diameter
            )
        }
    }

    public isOutOfLimits(): boolean {
        return this.distVector({ x:0, y:0 }) > LIMITS
    }

    public isOutOfViewPort(): boolean {
        return this.distVector({ x:0, y:0 }) > VIEWPORT
    }

    public isOnScreen( ignoreDiameter:boolean = false ): boolean {
        const diameter = ignoreDiameter ? 0 : this.diameter
        return (
            this.x + diameter > this.p.width * -.5 &&
            this.x - diameter < this.p.width * .5 &&
            this.y + diameter > this.p.height * -.5 &&
            this.y - diameter < this.p.height * .5
        )
    }

    public dist( positionable:Positionable ): number {
        return this.distVector(positionable) - (this.radius + positionable.radius)
    }

    public touch( positionable:Positionable ): boolean {
        return this.dist(positionable) <= 0
    }

    public distVector( vector:Vector2D ): number {
        return this.p.dist(
            vector.x,
            vector.y,
            this.x, this.y
        )
    }

    public touchVector( vector:Vector2D ): boolean {
        return this.distVector(vector) <= this.radius
    }

}
