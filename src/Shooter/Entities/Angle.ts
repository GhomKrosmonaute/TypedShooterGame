import p5 from 'p5';
import {map} from '../../utils';
import {Vector2D} from '../../interfaces';
import Shot from './Shot';
import App from '../App';

export default class Angle {

    constructor(
        private p:p5,
        public degrees:number = 0
    ) {}

    get radians(): number {
        return this.p.radians(this.degrees)
    }
    set radians( radians:number ){
        this.degrees = this.p.degrees(radians)
        this.normalize()
    }

    public move( degrees:number ): Angle {
        this.degrees += degrees
        return this.normalize()
    }

    public pointTo(angle:Angle, speedDegrees:number = 360, ignoreOpposite:boolean = false ): Angle {
        if(angle.degrees === this.degrees) return this
        const { dist, sens } = Angle.pathFinder(this,angle)
        if(ignoreOpposite && dist > 135) return this
        if(dist < speedDegrees)
            speedDegrees = dist
        return this.move(speedDegrees * sens)
    }

    public normalize(): Angle {
        if(this.degrees < 0)
            this.degrees += 360
        if(this.degrees > 359)
            this.degrees -= 360
        return this
    }

    public clone(): Angle {
        return new Angle(this.p,this.degrees)
    }

    static pathFinder( angle:Angle, target:Angle ): { dist:number, sens:number } {
        const dist = { toUp: 0, toDown: 0 }
        let newAngle = new Angle(angle.p,angle.degrees)
        for(let i=0; i<181; i++){
            if(Math.floor(newAngle.degrees) === Math.floor(target.degrees))
                break
            newAngle.move(-1)
            dist.toDown ++
        }
        newAngle = new Angle(angle.p,angle.degrees)
        for(let i=0; i<181; i++){
            if(Math.floor(newAngle.degrees) === Math.floor(target.degrees))
                break
            newAngle.move(1)
            dist.toUp ++
        }
        return {
            sens: dist.toUp < dist.toDown ? 1 : -1,
            dist: dist.toUp < dist.toDown ? dist.toUp : dist.toDown
        }
    }

    static between(p:p5, a:Vector2D, b:Vector2D ): Angle {
        p.angleMode(p.RADIANS)
        return new Angle(p,p.degrees(
            p.atan2(
                b.y - a.y,
                b.x - a.x
            ) + p.PI
        ))
    }

    static fromDirectionalKeys( app:App, type:'shoot'|'move' ): Angle {
        if(
            (
                app.keyIsPressed(type,'up') &&
                app.keyIsPressed(type,'left') &&
                app.keyIsPressed(type,'right')
            ) || (
                app.keyIsPressed(type,'up') &&
                !app.keyIsPressed(type,'left') &&
                !app.keyIsPressed(type,'right')
            )
        ){ return new Angle(app.p,90) } else if(
            (
                app.keyIsPressed(type,'down') &&
                app.keyIsPressed(type,'left') &&
                app.keyIsPressed(type,'right')
            ) || (
                app.keyIsPressed(type,'down') &&
                !app.keyIsPressed(type,'left') &&
                !app.keyIsPressed(type,'right')
            )
        ){ return new Angle(app.p,270) } else if(
            (
                app.keyIsPressed(type,'left') &&
                app.keyIsPressed(type,'up') &&
                app.keyIsPressed(type,'down')
            ) || (
                app.keyIsPressed(type,'left') &&
                !app.keyIsPressed(type,'up') &&
                !app.keyIsPressed(type,'down')
            )
        ){ return new Angle(app.p,0) } else if(
            (
                app.keyIsPressed(type,'right') &&
                app.keyIsPressed(type,'up') &&
                app.keyIsPressed(type,'down')
            ) || (
                app.keyIsPressed(type,'right') &&
                !app.keyIsPressed(type,'up') &&
                !app.keyIsPressed(type,'down')
            )
        ){ return new Angle(app.p,180) } else if(
            app.keyIsPressed(type,'up') &&
            app.keyIsPressed(type,'right')
        ){ return new Angle(app.p,135) } else if(
            app.keyIsPressed(type,'down') &&
            app.keyIsPressed(type,'right')
        ){ return new Angle(app.p,225) } else if(
            app.keyIsPressed(type,'down') &&
            app.keyIsPressed(type,'left')
        ){ return new Angle(app.p,315) } else if(
            app.keyIsPressed(type,'up') &&
            app.keyIsPressed(type,'left')
        ){ return new Angle(app.p,45) }
    }

}