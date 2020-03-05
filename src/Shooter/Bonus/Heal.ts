import Bonus from '../Bonus';
import {Consumable} from '../../interfaces';

export default class Heal extends Bonus implements Consumable {

    public quantity = 1

    public exec(): void {
        this.app.player.life = this.app.player.lifeMax
    }

    public shape(x:number,y:number,w:number,h:number): void {
        this.p.rect(
            x + w * .4,
            y + h * .2,
            w * .2,
            h * .6,
            2
        )
        this.p.rect(
            x + w * .2,
            y + h * .4,
            w * .6,
            h * .2,
            2
        )
    }

    applyEffect(): void {
        this.app.player.addConsumable(this)
    }

}
