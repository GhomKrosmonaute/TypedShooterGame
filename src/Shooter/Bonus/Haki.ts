import Bonus from '../Bonus';
import {Passive} from '../../interfaces';

export default class Shield extends Bonus implements Passive {

    public level = 1

    shape(x: number, y: number, w: number, h: number): void {
        // TODO: shield
    }

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

}
