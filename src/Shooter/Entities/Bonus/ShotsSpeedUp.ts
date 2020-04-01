import Bonus from '../Bonus';
import {Passive} from '../../../interfaces';
import p5 from 'p5';
import {map} from '../../../utils';

export default class ShotsSizeUp extends Bonus implements Passive {

    public level = 1
    public levelMax = 3
    public id = 'shotsSpeedUp'
    public displayName = 'Shots Speed Up'
    public description = '{value}px per frame'

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
    }

    get value(): number {
        return map(this.level,0,3,this.party.player.baseShotSpeed,this.party.player.baseShotSpeed * 2)
    }

}
