import {Passive} from '../../interfaces';
import Bonus from '../Bonus';
import p5 from 'p5';

export default class Falcon extends Bonus implements Passive {

    public level = 1

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        // TODO: psy eye
    }

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

}
