import Positionable from './Positionable';
import App from './App';
import Variator from './Variator';
import {pickBonus} from '../utils';

export default abstract class Bonus extends Positionable {

    private radiusVariator = new Variator(-1,1,.2)
    public abstract applyEffect(): void
    public abstract id: string

    constructor(
        public app:App
    ){
        super( app.p, 0, 0, 20 )
        this.setPosition()
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
        this.radius += this.radiusVariator.step()
        if(this.app.areOnContact(this,this.app.player)){
            this.placeOutOfLimits()
            this.applyEffect()
        }
    }

    private setPosition(): void {
        while(this.isOnScreen()){
            this.x = this.p.random( this.p.width * -2, this.p.width * 2 )
            this.y = this.p.random( this.p.height * -2, this.p.height * 2 )
        }
    }

}
