import {Passive} from '../../interfaces';
import Bonus from '../Bonus';
import p5 from 'p5';

export default class AutoFireGuidance extends Bonus implements Passive {

    public level = 1
    public id = 'autoFireGuidance'
    public displayName = 'Automatic Fire Guidance'
    public description = '{value}px detection'

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        // TODO: psy eye
        this.p.textSize(h * .5)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.text('F',x + w * .5,y + h * .5)
    }

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

    get value(): number {
        return this.level * 100
    }

}
