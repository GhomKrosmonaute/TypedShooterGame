import p5 from 'p5';
import {map} from '../../utils';
import {Vector2D} from '../../interfaces';

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

    public move( degrees:number ): void {
        this.degrees += degrees
        this.normalize()
    }

    public pointTo(angle:Angle, speedDegrees:number ): void {
        if(angle.degrees === this.degrees) return
        const { dist, sens } = Angle.dist(this,angle)
        if(dist < speedDegrees)
            speedDegrees = dist
        this.degrees += speedDegrees * sens
        this.normalize()
    }

    private normalize(): void {
        if(this.degrees < 0)
            this.degrees += 360
        if(this.degrees > 360)
            this.degrees -= 360
    }

    static dist( angle:Angle, target:Angle ): { dist:number, sens:number } {
        let dist = { toUp: 0, toDown: 0 }
        let degrees = Math.round(angle.degrees)
        const degreesTarget = Math.round(target.degrees)
        for(let i=0; i<180; i++){
            if(degreesTarget === degrees) break
            degrees --
            if(degrees < 0)
                degrees += 360
            dist.toDown ++
        }
        degrees = Math.round(angle.degrees)
        for(let i=0; i<180; i++){
            if(degreesTarget === degrees) break
            degrees ++
            if(degrees > 360)
                degrees -= 360
            dist.toUp ++
        }
        return {
            sens: dist.toUp < dist.toDown ? 1 : -1,
            dist: dist.toUp < dist.toDown ? dist.toUp : dist.toDown
        }
    }

    static fromTo( p:p5, a:Vector2D, b:Vector2D ): Angle {
        p.angleMode(p.RADIANS)
        return new Angle(p,p.degrees(
            p.atan2(
                b.y - a.y,
                b.x - a.x
            ) + p.PI
        ))
    }

}