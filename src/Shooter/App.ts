import p5 from 'p5'
// @ts-ignore
import docImage from './images/doc.png'
import {GameAnimation, Keys, MoveKeys, PuttedAnimation, ShotKeys, Vector2D} from '../interfaces'
import Particles from './Particles'
import Enemy from './Enemy'
import Player from './Player'
import Bonus from './Bonus'
import Rate from './Rate'
import {fade, pickBonus, pickEnemy} from '../utils'

export default class App {

    private readonly docImage:p5.Image
    private readonly baseDocFadeOut = 10
    private readonly maxEnemyCount = 50
    private readonly minEnemyCount = 5

    public readonly version = '0.1.2'
    public readonly debug = false

    private showDoc:boolean
    private docFadeOut:number

    public keys:Keys = {}
    public player:Player
    public rate:Rate
    public background:Particles
    public foreground:Particles
    public particles:Particles
    public animations:PuttedAnimation[]
    public enemies:Enemy[]
    public bonus:Bonus[]
    public bonusState:number
    public lastBonusState:number
    public darkModeTransition:number

    constructor( public p:p5 ){

        const storage = localStorage.getItem('shooter')
        if( !storage ||
            !JSON.parse(storage).highScore ||
            JSON.parse(storage).version !== this.version
        ) localStorage.setItem('shooter',JSON.stringify({
            highScore: 0,
            darkMode: true,
            version: this.version
        }))

        this.darkModeTransition = this.darkMode ? 0 : 255
        this.docImage = p.loadImage(docImage)
        this.p.smooth()
        this.p.angleMode(this.p.DEGREES)
        this.reset()
    }

    public reset(): void {
        this.lastBonusState = 0
        this.bonusState = 2
        this.particles = new Particles(this,50,0,5)
        this.background = new Particles(this,30,0,1)
        this.foreground = new Particles(this,10,1,2)
        this.player = new Player(this)
        this.rate = new Rate(25)
        this.showDoc = true
        this.docFadeOut = this.baseDocFadeOut
        this.animations = []
        this.enemies = []
        this.bonus = []
        for(let i=0; i<this.enemyCount; i++){
            this.enemies.push(pickEnemy(this))
        }
    }

    public move( x:number, y:number ){
        this.background.move( x, y )
        this.foreground.move( x, y )
        this.enemies.forEach( enemy => enemy.move( x, y ) )
        this.player.shoots.forEach( shoot => {
            shoot.basePosition.move( x, y )
            shoot.move( x, y )
        })
        this.bonus.forEach( bonus => bonus.move( x, y ) )
    }

    public step(){
        if(this.darkMode){
            if(this.darkModeTransition > 0)
                this.darkModeTransition -= 25.5
        }else{
            if(this.darkModeTransition < 255)
                this.darkModeTransition += 25.5
        }
        const particlesStep = () => {
            this.particles.step()
            this.particles.move(
                this.p.map(this.p.mouseX, 0, this.p.width, -2,2) * -1,
                this.p.map(this.p.mouseY, 0, this.p.height, -2,2) * -1
            )
        }
        if(this.showDoc){
            if (
                !this.moveKeysIsNotPressed() ||
                !this.shootKeysIsNotPressed()
            ){
                this.showDoc = false
            }else{
                particlesStep()
            }
        }else if(this.docFadeOut > 0){
            particlesStep()
            this.docFadeOut --
        }else{
            this.background.step()
            this.foreground.step()
            this.bonus.forEach( bonus => bonus.step() )
            this.bonus = this.bonus.filter( bonus => !bonus.used )
            this.enemies = this.enemies.filter( enemy => !enemy.isOutOfLimits() )
            this.animations = this.animations.filter( anim => Date.now() < anim.endTime )
            while(this.enemies.length < this.enemyCount)
                this.enemies.push(pickEnemy(this))
            if(this.rate.canTrigger(true)){
                this.enemies.forEach( enemy => enemy.step() )
                this.player.step()
                if(this.player.score >= this.bonusState){
                    this.lastBonusState = this.bonusState
                    this.bonusState += Math.ceil(this.bonusState * .5)
                    const bonus = pickBonus(this)
                    this.bonus.push(bonus)
                    this.setAnimation({
                        value: { bonus, player: this.player },
                        duration: 2000,
                        draw: ( p, time, values:{ bonus:Bonus, player:Player } ) => {
                            if(!values.bonus.isOutOfLimits()){

                                // TODO: c'est mieux si le bonus émet une faible onde autour de lui
                                // TODO: il faut aussi faire briller le carré du score pour qu'on comprenne

                                p.stroke(200,0,10)
                                p.strokeWeight(
                                    fade( this.p, 20, {
                                        value: time,
                                        valueMax: 2000,
                                        overflow: 5
                                    })
                                )
                                p.line(
                                    values.player.x,
                                    values.player.y,
                                    values.bonus.x,
                                    values.bonus.y
                                )
                            }
                        }
                    })
                }
            }
        }
    }

    public draw(){
        this.p.background(this.dark)
        this.p.translate(
            this.p.width * .5,
            this.p.height * .5
        )
        if(!this.showDoc){
            this.background.draw()
            this.enemies.forEach( enemy => enemy.draw() )
            this.bonus.forEach( bonus => bonus.draw() )
            this.animations.forEach( anim => {
                anim.animation.draw( this.p,
                    Math.max(0,
                        Math.min( anim.animation.duration,
                            this.p.map( Date.now(),
                                anim.startTime,
                                anim.endTime,
                                0,
                                anim.animation.duration
                            )
                        )
                    ),
                    anim.animation.value
                )
            })
            this.player.draw()
            this.foreground.draw()
        }
        if(this.docFadeOut > 0){
            this.particles.draw()
            const docFade = (value:number) => this.p.map(this.docFadeOut,this.baseDocFadeOut,0,value,0)
            const shift:Vector2D = {
                x: this.p.map(this.p.mouseX,0,this.p.width,-15,15),
                y: this.p.map(this.p.mouseY,0,this.p.height,-15,15)
            }
            this.p.noStroke()
            this.p.fill(0,docFade(100))
            this.p.rect(
                -400 + shift.x,
                -300 + shift.y,
                800,
                600,
                50
            )
            this.p.tint(255, docFade(255))
            this.p.image(
                this.docImage,
                -400 + shift.x * 1.5,
                -300 + shift.y * 1.5
            )
        }else{
            const isHigh = this.player.score > this.player.highScore
            this.p.fill(0,90)
            this.p.noStroke()
            this.p.rect(this.p.width * -.3,this.p.height * -.5 + 50,this.p.width*.6,30,2)
            if(this.player.score > 0){
                isHigh ? this.p.noFill() : this.p.fill(170,0,250)
                this.p.rect(
                    this.p.width * -.3,
                    this.p.height * -.5 + 50,
                    Math.max(0,
                        Math.min(this.p.width * .6,
                            this.p.map( this.player.score,
                                0,
                                this.player.highScore,
                                0,
                                this.p.width * .6
                            )
                        )
                    ),
                    30,
                    2
                )
                this.p.fill(250,0,170)
                this.p.rect(
                    this.p.width * -.3,
                    this.p.height * -.5 + 70,
                    Math.max(0,
                        Math.min(this.p.width * .6,
                            this.p.map( this.player.score,
                                this.lastBonusState,
                                this.bonusState,
                                0,
                                this.p.width * .6
                            )
                        )
                    ),
                    10,
                    5
                )
            }
            this.p.noFill()
            isHigh ? this.p.stroke(255,215,0) : this.p.stroke(100)
            this.p.strokeWeight(3)
            this.p.rect(this.p.width*-.3,this.p.height * -.5 + 50,this.p.width*.6,30,2)
            this.p.noStroke()
            this.p.fill(this.light,200)
            this.p.textAlign(this.p.CENTER,this.p.CENTER)
            this.p.textSize(25)
            if(!isHigh) this.p.text(`${this.player.score} / ${this.player.highScore} pts`,0,this.p.height * -.5 + 65)
            else this.p.text(`${this.player.highScore} + ${this.player.score - this.player.highScore} pts`,0,this.p.height * -.5 + 65)
        }
    }

    public get darkMode(): boolean {
        return JSON.parse(localStorage.getItem('shooter')).darkMode
    }
    public set darkMode( activate:boolean ){
        const storage = JSON.parse(localStorage.getItem('shooter'))
        storage.darkMode = activate
        localStorage.setItem('shooter',JSON.stringify(storage))
    }
    public get dark(): number {
        return this.darkModeTransition
    }
    public get light(): number {
        return 255 - this.darkModeTransition
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
        if(key === 'm') this.darkMode = !this.darkMode
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
                        this.player.score, 0, 100, 5, 20
                    ),
                    this.maxEnemyCount
                )
            ),
            this.minEnemyCount
        )
    }

}
