import Bonus from '../Bonus';
import {Passive} from '../../interfaces';
import p5 from 'p5';

export default class Minigun extends Bonus implements Passive {

    public level = 1
    public id = 'minigun'
    public displayName = 'Mini-Gun'
    public description = 'Shots rate +'

    applyEffect(): void {
        this.app.player.addPassive(this)
    }

    shape(p:p5, x: number, y: number, w: number, h: number): void {
        // TODO: looking for a good shape
        this.p.textSize(h * .5)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.text('M',x + w * .5,y + h * .5)
    }

}
