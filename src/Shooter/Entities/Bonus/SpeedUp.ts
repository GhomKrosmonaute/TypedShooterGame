import Bonus from '../Bonus'
import {Passive} from '../../../interfaces'
import p5 from 'p5'

export default class SpeedUp extends Bonus implements Passive {

    public level = 1
    public levelMax = 3
    public id = 'speedUp'
    public displayName = 'Speed Up'
    public description = '{value}px per frame'

    applyEffect(): void {
        this.party.player.addPassive(this)
    }

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        // TODO: looking for a good shape
        this.p.textSize(h * .5)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.text('V',x + w * .5,y + h * .5)
    }

    get value(): number {
        return this.party.player.baseSpeedMax + this.level * (this.party.player.baseSpeedMax * (1/8))
    }

}
