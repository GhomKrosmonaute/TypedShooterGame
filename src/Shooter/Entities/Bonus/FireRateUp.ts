import Bonus from '../Bonus';
import {Passive} from '../../../interfaces';
import p5 from 'p5';

export default class FireRateUp extends Bonus implements Passive {

    public level = 1
    public levelMax = 4
    public id = 'fireRateUp'
    public displayName = 'Fire Rate Up'
    public description = 'Fires every {value}ms'

    applyEffect(): void {
        this.party.player.addPassive(this)
    }

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        // TODO: looking for a good shape
        this.p.textSize(h * .5)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.text('M',x + w * .5,y + h * .5)
    }

    get value(): number {
        return this.p.map(this.level,1,5,this.party.player.baseFireRate,100)
    }

}
