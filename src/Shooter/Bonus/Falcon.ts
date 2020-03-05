import {Passive} from '../../interfaces';
import Bonus from '../Bonus';

export default class Falcon extends Bonus implements Passive {

    public level = 1

    shape(x: number, y: number, w: number, h: number): void {
        // TODO: psy eye
    }

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

}
