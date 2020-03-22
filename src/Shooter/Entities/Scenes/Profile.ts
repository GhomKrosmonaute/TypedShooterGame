
import Scene from '../Scene';
import App from '../../App';
import Input from '../Input';
import Form from '../Form';
import Rate from '../Rate';
import Animation from '../Animation';

export default class Profile extends Scene {

    public animations:Animation[]
    public rate = new Rate(25)
    public time = 0
    private form:Form

    constructor( app:App ) {
        super(app)
        this.form = new Form( app,
            0, 0, this.p.width * .4, this.p.height * .4,
            [
                { placeholder: 'New username' },
                { placeholder: 'New password', hide: true },
                { placeholder: 'Current password', hide: true }
            ], true
        )
        this.reset()
    }

    reset(){
        this.form.inputs[1].value = ''
        this.form.inputs[2].value = ''
        this.app.api.get('profile').then( profile => {
            this.form.inputs[0].value = profile.username
        })
    }

    draw() {
        this.form.draw()
    }

    step() {

    }

    keyPressed( key:string ) {
        this.form.keyPressed(key)
    }

    mousePressed(){
        this.form.mousePressed()
    }

}