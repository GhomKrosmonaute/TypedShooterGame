import Bonus from '../Bonus';
import {Consumable} from '../../../interfaces';
import {VIEWPORT} from '../../../config';
import p5 from 'p5';
import Player from "../Player";

export default class DeadlyWave extends Bonus implements Consumable {

    public quantity = 1
    public id = 'deadlyWave'
    public displayName = 'Deadly Wave'
    public description = 'Kill enemies hit by ' + VIEWPORT + 'px wave'

    public applyEffect(){
        this.party.player.addConsumable(this)
    }

    public exec(): void {
        this.app.setAnimation({
            value: this.party.player,
            duration: 200,
            draw: ( p, time, player:Player) => {
                p.noFill()
                p.strokeWeight(
                    p.map(time,0,200,0,10)
                )
                p.stroke(200,0,200, p.map(time,0,100,0,255))
                p.ellipse(
                    player.x,
                    player.y,
                    p.map(time,0,200,0,VIEWPORT)
                )
            }
        })
        this.party.enemies.forEach( enemy => {
            if(!enemy.immune && this.party.player.dist(enemy) < VIEWPORT)
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