
import {Passive} from '../../interfaces';
import Bonus from '../Bonus';
import p5 from 'p5';

export default class Drill extends Bonus implements Passive {

    public level = 1
    public id = 'drill'

    shape(p:p5, x:number,y:number,w:number,h:number){
        this.p.ellipse(x+w*.5,y+h*.5,w*.6,h*.25)
    }

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

}
