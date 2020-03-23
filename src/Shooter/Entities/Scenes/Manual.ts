import Scene from '../Scene';
import Particles from '../Particles';
import {Vector2D} from '../../../interfaces';
import p5 from 'p5';
//@ts-ignore
import docImage from '../../images/doc.png';
import App from '../../App';
import Rate from '../Rate';
import Animation from '../Animation';

export default class Manual extends Scene {

    public animations:Animation[] = []
    public rate = new Rate(25)
    public time = 0

    public particles:Particles
    private ignoreKeysTime:number
    private readonly docImage:p5.Image
    private readonly ignoreKeysInterval = 500

    constructor( app:App ) {
        super(app)
        this.docImage = this.p.loadImage(docImage)
        this.particles = new Particles(this.app,50,0,5)
        this.reset()
    }

    reset(){
        this.ignoreKeysTime = this.time + this.ignoreKeysInterval
    }

    draw() {
        this.particles.draw()
        const shift:Vector2D = {
            x: this.p.map(this.p.mouseX,0,this.p.width,-15,15),
            y: this.p.map(this.p.mouseY,0,this.p.height,-15,15)
        }
        this.p.noStroke()
        this.p.fill(0,100)
        this.p.rect(
            -400 + shift.x,
            -300 + shift.y,
            800,
            600,
            50
        )
        this.p.tint(255)
        this.p.image(
            this.docImage,
            -400 + shift.x * 1.5,
            -300 + shift.y * 1.5
        )
        this.drawAnimations()
    }

    step() {
        this.particles.step()
        this.particles.move(
            this.p.map(this.p.mouseX, 0, this.p.width, -2,2) * -1,
            this.p.map(this.p.mouseY, 0, this.p.height, -2,2) * -1
        )
        if ( this.time > this.ignoreKeysTime && (
            this.app.moveKeyIsPressed() ||
            this.app.shootKeyIsPressed()
        ))  this.app.sceneName = 'party'
    }

    keyPressed(key: string) {

    }

    mousePressed(): any {
    }

}