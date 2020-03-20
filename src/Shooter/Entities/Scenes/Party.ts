import Scene from '../Scene';
import Enemy from '../Enemy';
import Bonus from '../Bonus';
import Particles from '../Particles';
import Player from '../Player';
import {pickBonus, pickEnemy} from '../../../utils';
import App from '../../App';

export default class PartyScene extends Scene {

    private readonly maxEnemyCount = 60
    private readonly minEnemyCount = 10

    public background:Particles
    public foreground:Particles
    public bonusState:number
    public lastBonusState:number
    public enemies:Enemy[]
    public bonus:Bonus[]
    public player:Player

    constructor( app:App ) {
        super(app)
        this.background = new Particles(this.app,30,0,1)
        this.foreground = new Particles(this.app,10,1,2)
        this.reset()
    }

    reset(){
        this.lastBonusState = 0
        this.bonusState = 2
        this.player = new Player(this)
        this.enemies = []
        this.bonus = []
        for(let i=0; i<this.enemyCount; i++){
            this.enemies.push(pickEnemy(this))
        }
    }

    draw() {
        this.background.draw()
        this.enemies.forEach( enemy => enemy.draw() )
        this.bonus.forEach( bonus => bonus.draw() )
        this.drawAnimations()
        this.player.draw()
        this.foreground.draw()
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
        this.p.fill(this.app.light,200)
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.textSize(25)
        if(!isHigh) this.p.text(`${this.player.score} / ${this.player.highScore} pts`,0,this.p.height * -.5 + 65)
        else this.p.text(`${this.player.highScore} + ${this.player.score - this.player.highScore} pts`,0,this.p.height * -.5 + 65)
    }

    async step() {
        this.background.step()
        this.foreground.step()
        this.bonus.forEach( bonus => bonus.step() )
        this.bonus = this.bonus.filter( bonus => !bonus.used )
        this.enemies = this.enemies.sort(( a:any, b:any ) => {
            return (b.currentRadius || b.radius) - (a.currentRadius || a.radius)
        }).filter( enemy => !enemy.isOutOfLimits() )
        while(this.enemies.length < this.enemyCount)
            this.enemies.push(pickEnemy(this))
        this.enemies.forEach( enemy => enemy.step() )
        await this.player.step()
        if(this.player.score >= this.bonusState){
            this.lastBonusState = this.bonusState
            this.bonusState += Math.ceil(this.bonusState * .5)
            const bonus = pickBonus(this)
            this.bonus.push(bonus)
        }
    }

    keyPressed( key:string ) {
        if(key === 'Escape') this.app.sceneName = 'pause'
        else this.player.keyPressed(key)
    }

    public move( x:number, y:number ) {
        this.background.move( x, y )
        this.foreground.move( x, y )
        this.enemies.forEach( enemy => enemy.move( x, y ) )
        this.player.shots.forEach(shoot => {
            shoot.basePosition.move( x, y )
            shoot.move( x, y )
        })
        this.bonus.forEach( bonus => bonus.move( x, y ) )
    }

    get enemyCount(): number {
        return Math.max(
            Math.floor(
                Math.min(
                    this.p.map(this.player.score, 0, 150, this.minEnemyCount, this.maxEnemyCount),
                    this.maxEnemyCount
                )
            ),
            this.minEnemyCount
        )
    }

}