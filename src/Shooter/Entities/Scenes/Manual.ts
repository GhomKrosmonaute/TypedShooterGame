import Scene from '../Scene';
import Particles from '../Particles';
import {Vector2D} from '../../../interfaces';
import App from '../../App';
import Link from '../Link';

export default class Manual extends Scene {

    public particles:Particles
    private ignoreKeysTime:number
    private readonly ignoreKeysInterval = 500

    constructor( app:App ) {
        super(app)
        this.particles = new Particles(this.app,50,0,5)
        const appZone = this.app.zone
        this.links.push(
            new Link( this,
                appZone.fractionX(1/6),
                appZone.fractionY(5/6), {
                    targetName: 'party'
                }
            ),
            new Link( this,
                appZone.fractionX(.5),
                appZone.fractionY(5/6), {
                    targetName: 'scores',
                    resetNew: true
                }
            ),
            new Link( this,
                appZone.fractionX(5/6),
                appZone.fractionY(5/6), {
                    targetName: 'profile',
                    resetNew: true
                }
            )
        )
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
        this.drawAnimations('all')
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