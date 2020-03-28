import App from '../App'
import Variation from './Variation'
import Party from './Scenes/Party'
import Positionable from './Positionable'
import textFadeOut from '../Animations/textFadeOut'
import { map } from '../../utils';

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
        if(this.isOnScreen()){
            this.p.ellipse(
                this.x,
                this.y,
                this.diameter
            )
        }
        this.showIfNotOnScreen()
    }

    public step(): void {

        this.diameter += this.radiusVariation.step()

        if(this.isOutOfLimits())
            this.placeOutOfViewport(true)

        if(this.calculatedTouch(this.party.player))
            this.use()

        if(this.app.debug) this.use()

    }

    public use(): void {
        if(this.used) return
        this.used = true
        this.applyEffect()
        const value = String(Math.round((this as any).value * 100) / 100)
        const description = this.description.replace('{value}', value)
        this.party.setAnimation(textFadeOut({
            position: this,
            className: 'high',
            attach: true,
            duration: 500,
            value: {
                text: `+ 1 pts`,
                color: this.p.color(this.app.light)
            }
        }))
        this.party.setAnimation({
            position: this,
            className: 'low',
            duration: 400,
            value: null,
            draw: a => {
                a.p.noFill()
                a.p.stroke(255,140,0,a.map(255,0))
                a.p.strokeWeight(3)
                a.p.ellipse(
                    a.position.x,
                    a.position.y,
                    a.map(10,100)
                )
            }
        })
        this.party.setPopup(`${this.displayName} : ${description}`)
    }
}
