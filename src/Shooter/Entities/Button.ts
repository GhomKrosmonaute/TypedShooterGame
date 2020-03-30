
import App from '../App';
import Zone from './Zone';
import p5 from 'p5';

export default class Button extends Zone {

    public p:p5

    constructor(
        public app:App,
        x:number,
        y:number,
        public text:string,
        public exec:(app:App)=>void
    ) {
        super(x,y,100,40,true)
        this.p = app.p
    }

    public draw(): void {
        const hovered = this.touchVector(this.app.mouseFromCenter)
        this.p.noFill()
        if(hovered){
            this.p.stroke(this.app.light(.2))
            this.p.strokeWeight(2)
        }else{
            this.p.stroke(this.app.color)
            this.p.strokeWeight(1)
        }
        this.p.rect(
            this.start.x,
            this.start.y,
            this.width,
            this.height
        )
        const shift = this.app.mouseShift(5)
        this.p.noStroke()
        this.p.fill(hovered ? this.app.light(.2) : this.app.color)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.textSize(this.fractionHeight(.7))
        this.p.text(
            this.text,
            this.center.x,
            this.center.y
        )
    }

    public mousePressed(): void {
        if(this.touchVector(this.app.mouseFromCenter))
            this.exec(this.app)
    }

}