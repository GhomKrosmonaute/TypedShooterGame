import Bonus from '../Bonus';
import {Passive} from '../../interfaces';
import p5 from 'p5';

export default class Shield extends Bonus implements Passive {

    public level = 1

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        // TODO: shield
    }

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

}
