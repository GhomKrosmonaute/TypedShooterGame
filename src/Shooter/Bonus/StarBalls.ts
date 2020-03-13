import Bonus from '../Bonus'
import {Consumable} from '../../interfaces'
import {seconds, star} from '../../utils'
import p5 from 'p5'

export default class StarBalls extends Bonus implements Consumable {

    public quantity = 1
    public id = 'starBalls'
    public displayName = 'Star Balls'
    public description = 'Temporary multidirectional shots'
    
    applyEffect(): void {
        this.app.player.addConsumable(this)
    }

    public exec(): void {
        this.app.player.setTemporary('star', seconds(15), this.shape )
    }

    public shape(p:p5,x:number,y:number,w:number,h:number): void {
        star(
            p,
            x+w*.5,
            y+h*.5,
            w*.1,
            w*.3,
            8
        )
    }

}
