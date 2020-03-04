import p5 from 'p5';
import {Keys, MoveKeys, ShotKeys} from '../interfaces';
import Particles from './Particles';
import Positionable from './Positionable';

export default class App {

    private readonly keysImage:p5.Image
    private readonly showKeysStepsInit = 10
    private readonly maxEnemyCount = 30

    private showKeys:boolean
    private showKeysSteps:number

    public keys:Keys = {}
    public enemyCount:number
    public player:Player
    public rate:Gamerate
    public background:Particles
    public foreground:Particles
    public enemies:Ennemy[]
    public bonus:Bonus[]

    constructor( public p:p5 ){

        if(!localStorage.getItem('shooter'))
            localStorage.setItem('shooter','{"highscore":0}')

        this.keysImage = p.loadImage('img/keys.png')
        this.reset()
    }

    public reset(): void {
        this.showKeys = true
        this.showKeysSteps = this.showKeysStepsInit
        this.enemyCount = 5
        this.player = new Player(this)
        this.rate = new Gamerate(30)
        this.background = new Particles(this,30,0,1)
        this.foreground = new Particles(this,10,1,2)
        this.enemies = []
        this.bonus = []
        for(let i=0; i<this.enemyCount; i++){
            this.enemies.push(
                new existingEnnemies[Math.floor(Math.random()*existingEnnemies.length)](this)
            )
        }
    }

    public step(){
        if(this.showKeys){
            if (
                !this.moveKeysIsNotPressed() ||
                !this.shootKeysIsNotPressed()
            ){
                this.showKeys = false
            }
        }else if(this.showKeysSteps > 0){
            this.showKeysSteps --
        }else{
            this.background.step()
            this.foreground.step()
            this.bonus.forEach( bonus => bonus.step() )
            this.bonus = this.bonus.filter( bonus => !bonus.isOutOfLimits() )
            this.enemies = this.enemies.filter( enemy => !enemy.isOutOfLimits() )
            this.enemyCount = Math.floor(Math.min(map(this.player.score, 0, 100, 4, 20), this.maxEnemyCount))
            while(this.enemies.length < this.enemyCount)
                this.enemies.push(
                    new existingEnnemies[Math.floor(Math.random()*existingEnnemies.length)](this)
                )
            if(this.rate.canTrigger(true)) {
                this.enemies.forEach( enemy => enemy.step() )
                this.player.step()
            }
            if(Math.random() < .05)
                this.bonus.push(
                    new existingBonus[Math.floor(Math.random()*existingBonus.length)](this)
                )
        }
    }

    public move( x:number, y:number ){
        this.background.move( x, y )
        this.foreground.move( x, y )
        this.enemies.forEach( enemy => enemy.move(x,y) )
        this.player.shoots.forEach( shoot => shoot.move(x,y) )
        this.bonus.forEach( bonus => bonus.move(x,y) )
    }

    public draw(){
        const {
            background, tint, image, rect,
            map, width, height, noFill, fill,
            stroke, strokeWeight, translate,
            noStroke, CENTER, textAlign,
            textSize, text
        } = this.p
        background(0)
        translate(
            width * .5,
            height * .5
        )
        if(!this.showKeys){
            this.background.draw()
            this.enemies.forEach( enemy => enemy.draw() )
            this.bonus.forEach( bonus => bonus.draw() )
            this.player.draw()
            this.foreground.draw()
        }
        if(this.showKeysSteps > 0){
            tint(255, map(this.showKeysSteps,this.showKeysStepsInit,0,255,0))
            image(this.keysImage,-400,-300)
        }else{
            const isHigh = this.player.score > this.player.highscore
            fill(0,90)
            rect(width*-.3,height * -.5 + 50,width*.6,30,2)
            isHigh ? noFill() : fill(170,0,250)
            rect(
                width*-.3,
                height * -.5 + 50,
                Math.min(map(this.player.score,0,this.player.highscore,0,width*.6),width*.6),
                30,
                2
            )
            noFill()
            isHigh ? stroke(255,215,0) : stroke(100)
            strokeWeight(3)
            rect(width*-.3,height * -.5 + 50,width*.6,30,2)
            noStroke()
            fill(255,200)
            textAlign(CENTER,CENTER)
            textSize(25)
            if(!isHigh) text(`${this.player.score} / ${this.player.highscore} pts`,0,height * -.5 + 65)
            else text(`${this.player.highscore} + ${this.player.score - this.player.highscore} pts`,0,height * -.5 + 65)
        }
    }

    public keyReleased(key:string){ this.keys[key] = false }
    public keyPressed(key:string){ this.keys[key] = true
        this.player.keyPressed(key)
    }

    public moveKeysIsNotPressed(){
        for(const key in this.keys)
            if(this.keys[key] && Object.values(MoveKeys).includes(key)) return false
        return true
    }

    public shootKeysIsNotPressed(){
        for(const key in this.keys)
            if(this.keys[key] && Object.values(ShotKeys).includes(key)) return false
        return true
    }

    public areOnContact( positionable1:Positionable, positionable2:Positionable ){
        return (
            this.p.dist(
                positionable1.x, positionable1.y,
                positionable2.x, positionable2.y
            ) < (
                (positionable1.currentRadius || positionable1.radius) +
                (positionable2.currentRadius || positionable2.radius)
            ) / 2
        )
    }

}
