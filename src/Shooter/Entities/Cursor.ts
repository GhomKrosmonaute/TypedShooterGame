import Positionable from './Positionable';
import App from '../App';

export default class Cursor extends Positionable {

    private readonly baseFadeOut = 1000
    private fadeOut = 0

    public mode:'pointer'|'default'='default'

    constructor( public app:App ) {
        super(app.p,
            app.mouseFromCenter.x,
            app.mouseFromCenter.y,
            5
        )
    }

    private get auraDiameter(): number {
        return 15 + Math.min(30,this.rawDist(this.app.mouseFromCenter) * .5)
    }

    public step(): void {
        this.target(this.app.mouseFromCenter,.5)
    }

    public draw(): void {
        if(Date.now() < this.fadeOut){
            const alpha = this.p.map(
                this.fadeOut - Date.now(),
                0,
                this.baseFadeOut,
                0,
                255
            )
            this.p.fill(this.app.light, alpha)
            this.p.noStroke()
            this.p.ellipse(this.x,this.y,this.diameter)
            this.p.noFill()
            this.p.stroke(this.app.light, alpha)
            this.p.strokeWeight(2)
            this.p.ellipse(this.x,this.y,this.auraDiameter)
        }
    }

    mouseMoved() {
        this.fadeOut = Date.now() + this.baseFadeOut
    }

}