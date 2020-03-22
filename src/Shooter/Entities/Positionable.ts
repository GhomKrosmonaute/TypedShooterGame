import p5 from 'p5';
import {Vector2D} from "../../interfaces";
import {LIMITS,SECURITY,VIEWPORT} from '../../config'

export default class Positionable {

    constructor(
        public p:p5,
        public x:number = 0,
        public y:number = 0,
        public z:number = 0
    ){}

    public get radius(): number { return this.z }
    public set radius( z ){ this.z = z }

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
        if(this.dist(target) <= speed * 2) return
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
        if(this.dist(target) > 5)
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
                15
            )
        }
    }

    public isOutOfLimits(): boolean {
        return this.dist({ x:0, y:0}) > LIMITS
    }

    public isOutOfViewPort(): boolean {
        return this.dist({ x:0, y:0}) > VIEWPORT
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

    public dist( positionable:Vector2D ): number {
        return this.p.dist(
            positionable.x,
            positionable.y,
            this.x, this.y
        )
    }

}
