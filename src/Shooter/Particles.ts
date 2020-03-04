import App from './App'
import p5 from 'p5'
import Positionable from './Positionable';

export default class Particles extends Positionable {

    private children:Particle[]

    constructor(
        public app:App,
        private readonly particleCount:number,
        public min:number,
        public max:number
    ){
        super( app.p )
        this.children = []
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
        return this.p.map( this.z, 0, 1, 20, 80 ) * this.intensity
    }

    private reset(){
        const { random, color, width, height } = this.parent.app.p
        this.color = color(random(100,255),0,random(100,255))
        this.intensity = 0
        this.z = random( this.parent.min, this.parent.max )
        this.x = random( -width, width )
        this.y = random( -height, height )
    }

    public move( x:number, y:number ){
        super.move(
            x * (this.z / 2),
            y * (this.z / 2)
        )
    }

    public step(){
        if(this.intensity < 1)
            this.intensity += .023
        if(!this.isOnScreen())
            this.reset()
    }

    public draw(){
        const { fill, ellipse } = this.p
        this.color.setAlpha(this.opacity)
        fill(this.color)
        ellipse(
            this.x,
            this.y,
            5 + this.z * 5
        )
    }

}
