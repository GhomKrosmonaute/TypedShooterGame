import Positionable from './Positionable';
import App from './App';
import Variation from './Variation';
import {Consumable, Passive} from "../interfaces";
import {fade} from "../utils";

export default abstract class Bonus extends Positionable {

    private radiusVariation = new Variation(-1,1,.2)
    public abstract applyEffect(): void
    public abstract id: string
    public used = false

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

        if(this.isOutOfLimits())
            this.placeOutOfViewport(true)

        if(this.app.areOnContact(this,this.app.player))
            this.use()

    }

    public use(): void {
        if(this.used) return
        this.used = true
        this.applyEffect()
        if(this.app.debug)
        this.app.setAnimation({
            value: this,
            duration: 3000,
            draw(p, time, bonus:Passive|Consumable): void {
                p.noStroke()
                p.fill(bonus.app.light, fade(p,30, {
                    value: time,
                    valueMax: 3000,
                    overflow: 7
                }))
                p.rect(
                    p.width * -.5,
                    p.height * -.30,
                    p.width,
                    p.height * .10
                )
                p.fill(bonus.app.light, fade(p,255, {
                    value: time,
                    valueMax: 3000,
                    overflow: 4
                }))
                p.textAlign(p.CENTER,p.CENTER)
                p.text(`${bonus.displayName} : ${bonus.description}`, 0, p.height * -.25)
            }
        })
    }

}
