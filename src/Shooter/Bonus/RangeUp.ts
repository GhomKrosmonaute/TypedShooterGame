import Bonus from '../Bonus'
import {Passive} from '../../interfaces'
import p5 from 'p5'

export default class RangeUp extends Bonus implements Passive {

    public level = 1
    public id = 'rangeUp'
    public displayName = 'Range Up'
    public description = '{value}px'

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        // TODO: looking for a good shape
        this.p.textSize(h * .5)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.text('SN',x + w * .5,y + h * .5)
    }

    get value(): number {
        return this.app.player.baseShotRange + this.level * (this.app.player.baseShotRange * .5)
    }

}
