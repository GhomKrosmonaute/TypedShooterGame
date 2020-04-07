
import App from '../App';
import Zone from './Zone';
import p5 from 'p5';
import Scene from './Scene';

export default class Button extends Zone {

    public p:p5
    public app:App

    constructor(
        public scene:Scene,
        x:number,
        y:number,
        public text:string,
        public exec:(value:any)=>void,
        public value?:any
    ) {
        super(x,y,200,40,true)
        this.app = scene.app
        this.p = this.app.p
        if(!this.value) this.value = this
    }

    public draw(): void {
        const hovered = this.touchVector(this.app.mouseFromCenter)
        const shift = this.app.mouseShift(5)
        this.p.noStroke()
        this.p.fill(hovered ? this.app.light(.2) : this.app.color)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.textSize(this.fractionHeight(.7))
        this.p.text(
            this.text,
            shift.x + this.center.x,
            shift.y + this.center.y
        )
    }

    public mousePressed(): void {
        if(this.touchVector(this.app.mouseFromCenter))
            this.exec.bind(this.value)(this.value)
    }

}