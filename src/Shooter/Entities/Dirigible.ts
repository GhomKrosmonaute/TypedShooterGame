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

    public getAngleMove( speed:number ): Vector2D {
        return {
            x: speed * this.p.cos(this.angle.radians),
            y: speed * this.p.sin(this.angle.radians)
        }
    }

    public moveByAngle(speed:number ): void {
        const move = this.getAngleMove(speed)
        this.move(
            move.x * -2,
            move.y * -2
        )
    }

    public follow( target:Vector2D, speed:number, rotationSpeed:number = 360 ): void {
        if(this.rawDist(target) <= speed * 2) return
        const targetAngle = Angle.between(this.p,this,target)
        this.angle.pointTo(targetAngle,rotationSpeed)
        this.moveByAngle( speed )
    }

    public repulsedBy( target:Vector2D, speed:number, rotationSpeed:number = 360 ): void {
        const targetAngle = Angle.between(this.p,this,target)
        targetAngle.move(180)
        this.angle.pointTo(targetAngle,rotationSpeed)
        this.moveByAngle( speed )
    }

    public target( target:Vector2D, speedFraction:number ): void {
        if(this.rawDist(target) > 5)
            super.move(
                (target.x - this.x) * speedFraction,
                (target.y - this.y) * speedFraction
            )
    }

}