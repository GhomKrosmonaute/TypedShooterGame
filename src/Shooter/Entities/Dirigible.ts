import Positionable from './Positionable';
import {Vector2D} from '../../interfaces';
import p5 from 'p5';
import Angle from './Angle';

export default class Dirigible extends Positionable {

    constructor(
        p:p5,
        x = 0,
        y = 0,
        diameter = 0,
        public angle = new Angle(p)
    ) {
        super(p,x,y,diameter)
    }

    public angleMove(speed:number ): void {
        const speedX = speed * this.p.cos(this.angle.radians)
        const speedY = speed * this.p.sin(this.angle.radians)
        this.move(
            speedX * -2,
            speedY * -2
        )
    }

    public follow( target:Vector2D, speed:number, rotationSpeed:number = 360 ): void {
        if(this.rawDist(target) <= speed * 2) return
        this.p.angleMode(this.p.RADIANS)
        const targetAngle = new Angle(this.p,this.p.degrees(
            this.p.atan2(
                target.y - this.y,
                target.x - this.x
            ) + this.p.PI
        ))
        this.angle.pointTo(targetAngle,rotationSpeed)
        this.angleMove( speed )
    }

    public repulseBy( target:Vector2D, speed:number, rotationSpeed:number = 360 ): void {
        this.p.angleMode(this.p.RADIANS)
        const targetAngle = new Angle(this.p,this.p.degrees(
            this.p.atan2(
                target.y - this.y,
                target.x - this.x
            ) + this.p.PI
        ))
        targetAngle.move(180)
        this.angle.pointTo(targetAngle,rotationSpeed)
        this.angleMove( speed )
    }

    public target( target:Vector2D, speedFraction:number ): void {
        if(this.rawDist(target) > 5)
            super.move(
                (target.x - this.x) * speedFraction,
                (target.y - this.y) * speedFraction
            )
    }

}