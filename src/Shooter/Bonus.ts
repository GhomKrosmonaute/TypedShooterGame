import Positionable from './Positionable';
import App from './App';
import Variator from './Variator';

export default class Bonus extends Positionable {

    private radiusVariator:Variator = new Variator(-1,1,.2)
    protected applyEffect:()=>void = ()=>{}

    constructor(
        public app:App
    ){
        super( app.p, 0, 0, 20 )
        this.setPosition()
    }

    public draw(): void {
        const { noFill, stroke, strokeWeight, ellipse, noStroke } = this.p
        noFill()
        stroke(255,0,50)
        strokeWeight(3)
        ellipse(
            this.x,
            this.y,
            this.radius
        )
        noStroke()
    }

    public step(): void {
        this.radius += this.radiusVariator.step()
        if(this.app.areOnContact(this,this.app.player)){
            this.placeOutOfLimits()
            this.applyEffect()
        }
    }

    private setPosition(): void {
        const { random, width, height } = this.p
        while(this.isOnScreen()){
            this.x = random( width * -2, width * 2 )
            this.y = random( height * -2, height * 2 )
        }
    }

}