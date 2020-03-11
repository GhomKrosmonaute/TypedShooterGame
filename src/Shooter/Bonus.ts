import Positionable from './Positionable';
import App from './App';
import Variation from './Variation';

export default abstract class Bonus extends Positionable {

    private radiusVariation = new Variation(-1,1,.2)
    public abstract applyEffect(): void
    public abstract id: string

    constructor(
        public app:App
    ){
        super( app.p, 0, 0, 20 )
        this.placeOutOfViewport(true)
    }

    public draw(): void {
        this.p.noFill()
        this.p.stroke(255,0,50)
        this.p.strokeWeight(3)
        this.p.ellipse(
            this.x,
            this.y,
            this.radius
        )
        this.p.noStroke()
    }

    public step(): void {
        this.radius += this.radiusVariation.step()
        if(this.app.areOnContact(this,this.app.player)){
            this.placeOutOfLimits()
            this.applyEffect()
        }
    }

}
