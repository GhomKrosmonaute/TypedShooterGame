import Bonus from '../Bonus';
import {Passive} from '../../../interfaces';
import p5 from 'p5';

export default class ShotsSizeUp extends Bonus implements Passive {

    public level = 1
    public id = 'shotsSizeUp'
    public displayName = 'Shots Size Up'
    public description = '{value}px'

    applyEffect(): void {
        this.party.player.addPassive(this)
    }

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        p.rect(
            x + w * .2,
            y + h * .2,
            w * .2,
            h * .6
        )
        p.rect(
            x + w * .6,
            y + h * .2,
            w * .2,
            h * .6
        )
        p.rect(
            x + w * .4,
            y + h * .4,
            w * .2,
            h * .4
        )
    }

    get value(): number {
        return this.party.player.baseShotSize + this.level * (this.party.player.baseShotSize * .25)
    }

}
