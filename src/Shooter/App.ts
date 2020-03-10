import p5 from 'p5'
// @ts-ignore
import keysImage from './images/keys.png'
import {GameAnimation, Keys, MoveKeys, PuttedAnimation, ShotKeys} from '../interfaces';
import Particles from './Particles'
import Enemy from './Enemy'
import Player from './Player'
import Bonus from './Bonus'
import Rate from './Rate'
import { pickBonus, pickEnemy } from '../utils';

export default class App {

    private readonly keysImage:p5.Image
    private readonly showKeysStepsInit = 10
    private readonly bonusFrequency = .01
    private readonly maxEnemyCount = 30
    private readonly minEnemyCount = 5

    public readonly debug = false

    private showKeys:boolean
    private showKeysSteps:number

    public keys:Keys = {}
    public player:Player
    public rate:Rate
    public background:Particles
    public foreground:Particles
    public particles:Particles
    public animations:PuttedAnimation[]
    public enemies:Enemy[]
    public bonus:Bonus[]

    constructor( public p:p5 ){

        const storage = localStorage.getItem('shooter')
        if(!storage || !JSON.parse(storage).highScore)
            localStorage.setItem('shooter','{"highScore":0}')

        this.keysImage = p.loadImage(keysImage)
        this.p.smooth()
        this.reset()
    }

    public reset(): void {
        this.particles = new Particles(this,50,0,5)
        this.background = new Particles(this,30,0,1)
        this.foreground = new Particles(this,10,1,2)
        this.player = new Player(this)
        this.rate = new Rate(25)
        this.showKeys = true
        this.showKeysSteps = this.showKeysStepsInit
        this.animations = []
        this.enemies = []
        this.bonus = []
        for(let i=0; i<this.enemyCount; i++){
            this.enemies.push(pickEnemy(this))
        }
    }

    public step(){
        if(this.showKeys){
            if (
                !this.moveKeysIsNotPressed() ||
                !this.shootKeysIsNotPressed()
            ){
                this.showKeys = false
            }else{
                this.particles.step()
                this.particles.move(
                    this.p.map(this.p.mouseX, 0, this.p.width, -2,2),
                    this.p.map(this.p.mouseY, 0, this.p.height, -2,2)
                )
            }
        }else if(this.showKeysSteps > 0){
            this.particles.step()
            this.particles.move(
                this.p.map(this.p.mouseX, 0, this.p.width, -2,2),
                this.p.map(this.p.mouseY, 0, this.p.height, -2,2)
            )
            this.showKeysSteps --
        }else{
            this.background.step()
            this.foreground.step()
            this.bonus.forEach( bonus => bonus.step() )
            this.bonus = this.bonus.filter( bonus => !bonus.isOutOfLimits() )
            this.enemies = this.enemies.filter( enemy => !enemy.isOutOfLimits() )
            this.animations = this.animations.filter( anim => Date.now() < anim.endTime )
            while(this.enemies.length < this.enemyCount)
                this.enemies.push(pickEnemy(this))
            if(this.rate.canTrigger(true)){
                this.enemies.forEach( enemy => enemy.step() )
                this.player.step()
                if(Math.random() < this.bonusFrequency)
                    this.bonus.push(pickBonus(this))
            }
        }
    }

    public move( x:number, y:number ){
        this.background.move( x, y )
        this.foreground.move( x, y )
        this.enemies.forEach( enemy => enemy.move(x,y) )
        this.player.shoots.forEach( shoot => {
            shoot.basePosition.move( x, y )
            shoot.move( x, y )
        })
        this.bonus.forEach( bonus => bonus.move(x,y) )
    }

    public draw(){
        this.p.background(0)
        this.p.translate(
            this.p.width * .5,
            this.p.height * .5
        )
        if(!this.showKeys){
            this.background.draw()
            this.enemies.forEach( enemy => enemy.draw() )
            this.animations.forEach( anim => {
                anim.animation.draw( this,
                    Math.max(
                        0,
                        Math.min(
                            anim.animation.duration,
                            this.p.map(
                                Date.now(),
                                anim.startTime,
                                anim.endTime,
                                0,
                                anim.animation.duration
                            )
                        )
                    )
                )
            })
            this.bonus.forEach( bonus => bonus.draw() )
            this.player.draw()
            this.foreground.draw()
        }
        if(this.showKeysSteps > 0){
            this.particles.draw()
            this.p.tint(255, this.p.map(this.showKeysSteps,this.showKeysStepsInit,0,255,0))
            this.p.image(
                this.keysImage,
                -400 + this.p.map(this.p.mouseX,0,this.p.width,-15,15),
                -300 + this.p.map(this.p.mouseY,0,this.p.height,-15,15)
            )
        }else{
            const isHigh = this.player.score > this.player.highScore
            this.p.fill(0,90)
            this.p.rect(this.p.width*-.3,this.p.height * -.5 + 50,this.p.width*.6,30,2)
            if(this.player.score > 0){
                isHigh ? this.p.noFill() : this.p.fill(170,0,250)
                this.p.rect(
                    this.p.width*-.3,
                    this.p.height * -.5 + 50,
                    Math.max(
                        0,
                        Math.min(
                            this.p.map(
                                this.player.score,
                                0,
                                this.player.highScore,
                                0,
                                this.p.width*.6
                            ),
                            this.p.width*.6
                        )
                    ),
                    30,
                    2
                )
                this.p.noFill()
            }
            isHigh ? this.p.stroke(255,215,0) : this.p.stroke(100)
            this.p.strokeWeight(3)
            this.p.rect(this.p.width*-.3,this.p.height * -.5 + 50,this.p.width*.6,30,2)
            this.p.noStroke()
            this.p.fill(255,200)
            this.p.textAlign(this.p.CENTER,this.p.CENTER)
            this.p.textSize(25)
            if(!isHigh) this.p.text(`${this.player.score} / ${this.player.highScore} pts`,0,this.p.height * -.5 + 65)
            else this.p.text(`${this.player.highScore} + ${this.player.score - this.player.highScore} pts`,0,this.p.height * -.5 + 65)
        }
    }

    public setAnimation( animation:GameAnimation ){
        const puttedAnimation:PuttedAnimation = {
            animation: animation,
            startTime: Date.now(),
            endTime: Date.now() + animation.duration
        }
        this.animations.push(puttedAnimation)
    }

    public keyReleased(key:string){ this.keys[key] = false }
    public keyPressed(key:string){ this.keys[key] = true
        this.player.keyPressed(key)
    }

    public moveKeysIsNotPressed(){
        for(const key in this.keys)
            if(this.keys[key] && Object.values(MoveKeys).includes(key as MoveKeys)) return false
        return true
    }

    public shootKeysIsNotPressed(){
        for(const key in this.keys)
            if(this.keys[key] && Object.values(ShotKeys).includes(key as ShotKeys)) return false
        return true
    }

    public areOnContact( positionable1:any, positionable2:any ){
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

    get enemyCount(): number {
        return Math.max(
            Math.floor(
                Math.min(
                    this.p.map(
                        this.player.score, 0, 100, 5, 10
                    ),
                    this.maxEnemyCount
                )
            ),
            this.minEnemyCount
        )
    }

}
