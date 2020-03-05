
import {Passive} from '../../interfaces';
import Bonus from '../Bonus';

export default class Drill extends Bonus implements Passive {

    public level = 1

    shape(x:number,y:number,w:number,h:number){
        this.p.ellipse(x+w*.5,y+h*.5,w*.6,h*.3)
    }

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

}