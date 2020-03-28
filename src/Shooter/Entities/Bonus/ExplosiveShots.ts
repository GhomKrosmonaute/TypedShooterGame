
import {Passive} from '../../../interfaces';
import Bonus from '../Bonus';
import p5 from 'p5';

export default class PiercingShots extends Bonus implements Passive {

    public level = 1
    public levelMax = 3
    public id = 'explosiveShots'
    public displayName = 'Explosive Shots'
    public description = 'Explosion {value}px'

    shape(p:p5, x:number,y:number,w:number,h:number){
        // TODO: looking for a good shape
        this.p.textSize(h * .5)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.text('E',x + w * .5,y + h * .5)
    }

    applyEffect(): void {
        this.party.player.addPassive(this)
    }

    get value(): number {
        return 50 + this.level * 25
    }

}
