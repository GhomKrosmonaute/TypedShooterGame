import Positionable from './Positionable';
import App from '../App';
import Variation from './Variation';
import Party from './Scenes/Party';

export default abstract class Bonus extends Positionable {

    private radiusVariation = new Variation(-1,1,.2)
    public abstract applyEffect(): void
    public abstract displayName:string
    public abstract description:string
    public abstract id: string
    public used = false
    public app:App

    constructor(
        public party:Party
    ){
        super( party.p, 0, 0, 20 )
        this.app = party.app
        this.placeOutOfViewport(true)
    }

    public draw(): void {
        this.p.noFill()
        this.p.stroke(255,0,50)
        this.p.strokeWeight(3)
        this.showIfNotOnScreen()
        this.p.ellipse(
            this.x,
            this.y,
            this.radius
        )
        this.p.noStroke()
    }

    public step(): void {

        this.radius += this.radiusVariation.step()

        if(this.isOutOfLimits())
            this.placeOutOfViewport(true)

        if(this.app.areOnContact(this,this.party.player))
            this.use()

    }

    public use(): void {
        if(this.used) return
        this.used = true
        this.applyEffect()
        const value = (this as any).value
        this.party.setPopup(`${this.displayName} : ${this.description.replace('{value}',value)}`)
    }
}
