import Bonus from '../Bonus';
import {Passive} from '../../interfaces';

export default class DeadChain extends Bonus implements Passive {

    public level = 1

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

    shape(x: number, y: number, w: number, h: number): void {
        // TODO: look to good shape
    }

}
