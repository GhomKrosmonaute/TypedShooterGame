import Bonus from '../Bonus';
import {Passive} from '../../interfaces';
import p5 from 'p5';

export default class Bazooka extends Bonus implements Passive {

    public level = 1

    applyEffect(): void {
        this.app.player.addPassive(this)
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

}
