import Bonus from '../Bonus';
import {Consumable} from '../../interfaces';
import p5 from 'p5';

export default class Carnage extends Bonus implements Consumable {

    public quantity = 1
    public id = 'carnage'

    public applyEffect(){
        this.app.player.addConsumable(this)
    }

    public exec(): void {
        this.app.setAnimation({
            duration: 100,
            draw: (app,time) => {
                app.p.noFill()
                app.p.strokeWeight(
                    app.p.map(time,0,100,0,10)
                )
                app.p.stroke(200,0,200, app.p.map(time,0,100,0,255))
                app.p.ellipse(
                    app.player.x,
                    app.player.y,
                    app.p.map(time,0,100,0,1000)
                )
            }
        })
        this.app.enemies.forEach( enemy => {
            if(this.app.player.dist(enemy) < 1000)
                enemy.kill(true)
        })
    }

    public shape(p:p5, x:number,y:number,w:number,h:number): void {
        p.ellipse(
            x + w * .5,
            y + h * .4,
            w * .7,
            h * .5
        )
        p.rect(
            x + w * .3,
            y + h * .4,
            w * .4,
            h * .4
        )
    }

}
