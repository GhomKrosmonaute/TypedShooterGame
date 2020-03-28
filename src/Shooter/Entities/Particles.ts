import App from '../App'
import p5 from 'p5'
import Positionable from './Positionable';
import { random } from '../../utils';

export default class Particles extends Positionable {

    private children:Particle[] = []

    constructor(
        public app:App,
        private readonly particleCount:number,
        public min:number,
        public max:number
    ){
        super( app.p )
        while(this.children.length < this.particleCount){
            this.children.push(new Particle(this))
        }
    }

    public move( x:number, y:number ){
        this.children.forEach( particle => particle.move( x, y ) )
    }

    public step(){
        this.children.forEach( particle => particle.step() )
    }

    public draw(){
        this.children.forEach( particle => particle.draw() )
    }

}

class Particle extends Positionable {

    private intensity:number
    private color:p5.Color

    constructor( private parent:Particles ){
        super(parent.app.p)
        this.reset()
    }

    private get opacity(){
        return this.p.map( this._diameter, 0, 1, 20, 80 ) * this.intensity
    }

    private reset(){
        this.color = this.parent.app.red(random(.3,.7))
        this.intensity = 0
        this._diameter = this.p.random( this.parent.min, this.parent.max )
        this.x = this.p.random( this.p.width * -.5, this.p.width * .5 )
        this.y = this.p.random( this.p.height * -.5, this.p.height * .5 )
    }

    public move( x:number, y:number ){
        super.move(
            x * (this._diameter / 2),
            y * (this._diameter / 2)
        )
    }

    public step(){
        if(this.intensity < 1)
            this.intensity += .023
        if(!this.isOnScreen())
            this.reset()
    }

    public draw(){
        this.color.setAlpha(this.opacity)
        this.p.noStroke()
        this.p.fill(this.color)
        this.p.ellipse(
            this.x,
            this.y,
            5 + this._diameter * 5
        )
    }

}
