
import Scene from '../Scene';
import App from '../../App';
import Form from '../Form';
import Link from '../Link';
import Button from '../Button';

export default class Profile extends Scene {

    private title:string

    constructor( app:App ) {
        super(app)
        this.form = new Form( app,
            0, 0, this.p.width * .4, this.p.height * .4,
            [
                { value:'', placeholder: 'New username', required: true },
                { value:'', placeholder: 'New password', required: true, hide: true },
                { value:'', placeholder: 'Current password', required: true, hide: true }
            ], true, form => {
                form.app.api.patch('profile', {
                    newUsername: form.inputs[0].value,
                    newPassword: form.inputs[1].value,
                    password: form.inputs[2].value
                }).then(form.app.scenes.profile.reset)
            }
        )
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
                    targetName: 'manual'
                }
            )
        )
        this.buttons.push(
            new Button(
                this.app,
                this.p.width * .2,
                this.p.height * .2,
                'Delete profile',
                (a)=>{
                    a.api.delete('profile')
                        // @ts-ignore
                        .then(Location.reload)
                }
            )
        )
        this.reset()
    }

    reset(){
        this.title = 'Profile customization'
        this.form.inputs[0].value = ''
        this.form.inputs[1].value = ''
        this.form.inputs[2].value = ''
        this.app.api.get<any>('profile')
            .then( player => {
                this.form.inputs[0].value = player.username
            })
    }

    draw() {
        this.p.noStroke()
        this.p.fill(this.app.color)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.textSize(35)
        this.p.text( this.title,0,this.p.height * -.35)
        this.drawButtons()
        this.drawAnimations()
    }

    step() {

    }

    keyPressed( key:string ) {
        this.form.keyPressed(key)
    }

}