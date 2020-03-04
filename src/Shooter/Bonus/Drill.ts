import App from '../App';
import {Passive} from '../../interfaces';
import Bonus from '../Bonus';

export default class Drill extends Bonus implements Passive {

    public level = 0

    constructor(
        public app:App
    ){
        super( app )
        this.applyEffect = () => {
            this.app.player.addPassive(this)
        }
    }

    shape(x:number,y:number,w:number,h:number){
        this.p.ellipse(x+w*.5,y+h*.5,w*.6,h*.3)
    }

}