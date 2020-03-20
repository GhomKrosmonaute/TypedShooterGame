
import Scene from '../Scene';
import Particles from '../Particles';
import {Vector2D} from '../../../interfaces';
import p5 from 'p5';
//@ts-ignore
import docImage from '../../images/doc.png';
import App from '../../App';
import Zone from '../Zone';

export default class ProfileScene extends Scene {

    private username:string = ''
    private password:string = ''
    private usernameZone:Zone
    private passwordZone:Zone

    constructor( app:App ) {
        super(app)
        this.usernameZone = new Zone(
            this.p.width * -.4, this.p.height * -.2,
            this.p.width * .4, this.p.height * -.05
        )
        this.usernameZone = new Zone(
            this.p.width * -.4, this.p.height * .05,
            this.p.width * .4, this.p.height * .2
        )
        this.reset()
    }

    reset(){
        this.app.api.get('profile').then( profile => {
            this.username = profile.username
        })
    }

    draw() {

    }

    step() {

    }

    keyPressed(key: string) {

    }

}