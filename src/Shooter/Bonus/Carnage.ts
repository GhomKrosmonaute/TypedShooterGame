import Bonus from '../Bonus';
import {Consumable} from '../../interfaces';
import p5 from 'p5';

export default class Carnage extends Bonus implements Consumable {

    public quantity = 1

    public applyEffect(){
        this.app.player.addConsumable(this)
    }

    public exec(): void {
        this.app.enemies.forEach( enemy => {
            if(this.dist(enemy) < 1000)
                enemy.kill(true)
        })
    }

    public shape(p:p5, x:number,y:number,w:number,h:number): void {
        // TODO: skull
    }

}
