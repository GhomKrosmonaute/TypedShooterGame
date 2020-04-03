import Bonus from '../Bonus';
import {Passive} from '../../../interfaces';
import p5 from 'p5';
import {map} from '../../../utils';

export default class RotationSpeedUp extends Bonus implements Passive {

    public level = 1
    public levelMax = 3
    public id = 'rotationSpeedUp'
    public displayName = 'Rotation Speed Up'
    public description = '{value}° per frame'

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
        switch(this.level){
            case 1: return 90
            case 2: return 135
            case 3: return 180
        }
    }

}
