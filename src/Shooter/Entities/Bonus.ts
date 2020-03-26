import Positionable from './Positionable';
import App from '../App';
import Variation from './Variation';
import Party from './Scenes/Party';
import textFadeOut from '../Animations/textFadeOut';

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
        this.p.stroke(255,140,0)
        this.p.strokeWeight(3)
        this.showIfNotOnScreen()
        this.p.ellipse(
            this.x,
            this.y,
            this.diameter
        )
        this.p.noStroke()
    }

    public step(): void {

        this.diameter += this.radiusVariation.step()

        if(this.isOutOfLimits())
            this.placeOutOfViewport(true)

        if(this.touch(this.party.player))
            this.use()

    }

    public use(): void {
        if(this.used) return
        this.used = true
        this.applyEffect()
        const value = (this as any).value
        this.party.setAnimation(textFadeOut({
            position: this,
            attach: true,
            duration: 500,
            value: {
                text: `+ 1 pts`,
                color: this.p.color(this.app.light)
            }
        }))
        this.party.setPopup(`${this.displayName} : ${this.description.replace('{value}',String(Math.round((value + Number.EPSILON) * 100) / 100))}`)
    }
}
