import Bonus from '../Bonus';
import { Passive } from '../../interfaces';
import p5 from 'p5';

export default class Shield extends Bonus implements Passive {

    public level = 1

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        // TODO: shield
        this.p.textSize(h * .5)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.text('SH',x + w * .5,y + h * .5)
    }

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

}
