
import Scene from '../Scene';
import App from '../../App';
import Form from '../Form';
import Link from '../Link';

export default class Profile extends Scene {

    constructor( app:App ) {
        super(app)
        this.form = new Form( app,
            0, 0, this.p.width * .4, this.p.height * .4,
            [
                { value:'', placeholder: 'New username' },
                { value:'', placeholder: 'New password', hide: true },
                { value:'', placeholder: 'Current password', hide: true }
            ], true
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
        this.reset()
    }

    reset(){
        this.form.inputs[0].value = ''
        this.form.inputs[1].value = ''
        this.form.inputs[2].value = ''
        this.app.api.get('leaderboard')
            .then( leaderBoard => {
                this.form.inputs[0].value = leaderBoard.player.username
            })
    }

    draw() {
        this.drawAnimations('all')
    }

    step() {

    }

    keyPressed( key:string ) {
        this.form.keyPressed(key)
    }

}