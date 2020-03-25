
import Positionable from './Positionable';
import Shot from './Shot';
import {Combo, Consumable, Passive, ShapeFunction, TemporaryEffects} from '../../interfaces';
import Rate from './Rate';
import Party from './Scenes/Party';
import App from '../App';
import API from '../API';
import ellipseColorFadeOut from '../Animations/ellipseColorFadeOut';
import explosion from '../Animations/explosion';
import textFadeOut from '../Animations/textFadeOut';

export default class Player extends Positionable {

    public baseLife = 5
    public life = 5
    public score = 0
    public baseSpeedMax = 10
    public baseShotSpeed = 10
    public baseShotRange = 300
    public baseShotDamage = 1
    public baseFireRate = 500
    public baseShotSize = 15
    public speedX = 0
    public speedY = 0
    public acc = 3
    public desc = .7
    public consumables:Consumable[] = []
    public passives:Passive[] = []
    public shots:Shot[] = []
    public temporary:TemporaryEffects = {}
    public shootRating:Rate
    public highScore:number = 0
    public app:App
    public api:API

    private combo:Combo = null
    private comboTimeout = 2500
    private comboStateSize = 10
    private comboMaxMultiplicator = 5
    private killed = false
    private immune:number
    private immuneTime = 500

    constructor(
        public party:Party
    ){
        super( party.app.p, 0, 0, 50 )
        this.app = party.app
        this.api = party.app.api
        this.immune = party.time
        this.shootRating = new Rate(this.baseFireRate)
        this.getHighScore().catch()
    }

    public getHighScore(): Promise<number> {
        return this.api.get('score').then( data => {
            this.highScore = data.score
            return this.highScore
        })
    }
    public setHighScore( score:number ): Promise<any> {
        return this.app.api.patch('score',{score})
    }

    public get speedMax(): number {
        const speedUp = this.getPassive('speedUp')
        if(!speedUp) return this.baseSpeedMax
        return speedUp.value
    }
    public get shotSpeed(): number {
        return this.baseShotSpeed
    }
    public get shotRange(): number {
        const rangeUp = this.getPassive('rangeUp')
        if(!rangeUp) return this.baseShotRange
        return rangeUp.value
    }
    public get shotDamage(): number {
        const damageUp = this.getPassive('damageUp')
        if(!damageUp) return this.baseShotDamage
        return damageUp.value
    }
    public get shotSize(): number {
        const shotsSizeUp = this.getPassive('shotsSizeUp')
        if(!shotsSizeUp) return this.baseShotSize
        return shotsSizeUp.value
    }
    public get fireRate(): number {
        const fireRateUp = this.getPassive('fireRateUp')
        if(!fireRateUp) return this.baseFireRate
        return fireRateUp.value
    }

    public setTemporary( flag:string, duration:number, shape:ShapeFunction ): void {
        if(
            !this.temporary[flag] ||
            this.temporary[flag].timeout < this.party.time
        )
            this.temporary[flag] = { shape,
                triggerTime: this.party.time,
                timeout: this.party.time + duration
            }
        else this.temporary[flag].timeout += duration
    }

    public getTemporary( flag:string ): boolean {
        if(!this.temporary[flag]) return false
        return this.temporary[flag].timeout > this.party.time
    }

    public addPassive( passive:Passive ): void {
        this.party.player.addScore(1)
        const exists = this.passives.find( p => p.id === passive.id )
        if(exists){
            if(exists.level < exists.levelMax)
                exists.level ++
            else this.party.player.addScore(10)
        }else{
            this.passives.push(passive)
        }
    }

    public removePassive( id:string ): void {
        const passive = this.getPassive(id)
        if(passive) {
            passive.level--
            if(passive.level <= 0)
                this.passives = this.passives.filter( p => p.id === id )
        }
    }

    public getPassive( id:string ): Passive | null {
        return this.passives.find( p => p.id === id )
    }

    public addConsumable( consumable:Consumable ): void {
        this.party.player.addScore(1)
        const exists = this.consumables.find( c => c.id === consumable.id )
        if(exists){
            exists.quantity ++
        }else{
            this.consumables.push(consumable)
        }
    }

    public addScore( score:number ): void {
        if(!this.combo){
            this.score += score
            this.combo = {
                hits: 1,
                multiplicator: 1,
                time: this.party.time
            }
        }else{
            this.combo.hits ++
            this.combo.time = this.party.time
            this.combo.multiplicator = Math.min(
                this.comboMaxMultiplicator,
                1 + Math.floor(this.combo.hits / this.comboStateSize)
            )
            this.score += score * this.combo.multiplicator
        }
        this.party.setAnimation(textFadeOut({
            position: {
                x: 0,
                y: this.radius * -1.8
            },
            attach: true,
            duration: 500,
            value: {
                text: `+ ${this.combo ? score * this.combo.multiplicator : score} pts`,
                color: this.p.color(this.app.light)
            }
        }))
    }

    public inflictDamages( damages:number ): void {
        this.party.setAnimation(ellipseColorFadeOut({
            attach: true,
            duration: 150,
            position: this,
            value: this.party.time > this.immune ?
                this.p.color(255,0,0) :
                this.p.color(0,0,255)
        }))
        this.party.setAnimation(textFadeOut({
            attach: true,
            duration: 250,
            position: {
                x: 0,
                y: this.radius * -1.8
            },
            value: {
                text: `- ${damages}`,
                color: this.p.color(255,0,0)
            }
        }))
        if(this.party.time > this.immune){
            this.immune = this.party.time + this.immuneTime
            this.life -= damages
        }
    }

    public async step(): Promise<void> {

        if(this.killed) return

        // COMBO

        if(this.combo && this.party.time > this.combo.time + this.comboTimeout)
            this.combo = null

        // DEATH ?

        if(this.life <= 0){
            this.killed = true
            if(this.score > await this.getHighScore())
                this.setHighScore(this.score).catch()
            this.party.setAnimation(explosion({
                value: this.radius * 1.5,
                duration: 700,
                callback: a => {
                    a.scene.app.sceneName = 'manual'
                    a.scene.app.scenes.party.reset()
                }
            }))
            return
        }

        // MOVES

        if(!this.app.moveKeyIsPressed()){

            this.speedX *= this.desc
            this.speedY *= this.desc

        }else{

            if(
                !this.app.keyIsPressed('move','left') &&
                !this.app.keyIsPressed('move','right')
            ) this.speedX *= this.desc

            if(
                !this.app.keyIsPressed('move','up') &&
                !this.app.keyIsPressed('move','down')
            ) this.speedY *= this.desc

            if(this.app.keyIsPressed('move','left')) this.speedX -= this.acc
            if(this.app.keyIsPressed('move','right')) this.speedX += this.acc
            if(this.app.keyIsPressed('move','up')) this.speedY -= this.acc
            if(this.app.keyIsPressed('move','down')) this.speedY += this.acc

            if(this.speedX < this.speedMax * -1) this.speedX = this.speedMax * -1
            if(this.speedY < this.speedMax * -1) this.speedY = this.speedMax * -1
            if(this.speedX > this.speedMax) this.speedX = this.speedMax
            if(this.speedY > this.speedMax) this.speedY = this.speedMax

        }

        if(this.speedX < .1 && this.speedX > -.1)
            this.speedX = 0

        if(this.speedY < .1 && this.speedY > -.1)
            this.speedY = 0

        this.place(
            this.speedX * .5,
            this.speedY * .5
        )
        this.party.move(
            this.speedX * -1,
            this.speedY * -1
        )

        // SHOOTS

        this.shootRating.interval = this.fireRate

        if(this.shootRating.canTrigger()){
            const direction = {
                x: this.p.map(this.speedX * .5, this.speedMax * -.5, this.speedMax * .5, -.4, .4),
                y: this.p.map(this.speedY * .5, this.speedMax * -.5, this.speedMax * .5, -.4, .4)
            }
            if(this.getTemporary('starBalls')){
                if(this.app.shootKeyIsPressed()){
                    this.shootRating.trigger()
                    this.shots.push(
                        new Shot( this,1 + direction.x, direction.y),
                        new Shot( this,-1 + direction.x, direction.y),
                        new Shot( this, direction.x,1 + direction.y),
                        new Shot( this, direction.x,-1 + direction.y),
                        new Shot( this,1 + direction.x,1 + direction.y),
                        new Shot( this,-1 + direction.x,1 + direction.y),
                        new Shot( this,1 + direction.x,-1 + direction.y),
                        new Shot( this,-1 + direction.x,-1 + direction.y)
                    )
                }
            }else{
                if(this.app.keyIsPressed('shoot','up')) direction.y -= 1
                if(this.app.keyIsPressed('shoot','left')) direction.x -= 1
                if(this.app.keyIsPressed('shoot','down')) direction.y += 1
                if(this.app.keyIsPressed('shoot','right')) direction.x += 1
                if(this.app.shootKeyIsPressed()){
                    this.shootRating.trigger()
                    this.shots.push( new Shot( this,
                        direction.x,
                        direction.y
                    ))
                }
            }

        }

        this.shots = this.shots.filter(shoot => !shoot.isOutOfLimits() )
        this.shots.forEach(shoot => shoot.step() )

    }

    public draw(): void {
        this.shots.forEach(shoot => shoot.draw() )
        if(this.killed) return
        if(this.app.lightMode) this.p.noStroke()
        else {
            this.p.stroke(0)
            this.p.strokeWeight(1)
        }
        this.p.fill(200,200,255)
        this.p.ellipse(this.x,this.y,this.radius)
        this.p.fill(0,100)
        this.p.stroke(this.app.light)
        this.p.strokeWeight(1)
        this.p.rect(this.x - 40,this.y - 50,80,14,5)
        this.p.noStroke()
        this.p.fill(
            this.p.map( this.life || this.baseLife, 0, this.baseLife, 255, 50 ),50,
            this.p.map( this.life || this.baseLife, 0, this.baseLife, 50, 255 ),200
        )
        this.p.rect(
            this.x - 40,
            this.y - 50,
            Math.max(0,this.p.map( this.life || this.baseLife, 0, this.baseLife, 0, 80 )),
            14, 5
        )
        if(this.combo){
            if(this.combo.multiplicator > 1){
                this.p.fill(this.app.light,Math.min(255,this.p.map(
                    this.party.time,
                    this.combo.time,
                    this.combo.time + this.comboTimeout,
                    500,
                    0
                )))
                this.p.noStroke()
                this.p.textAlign(this.p.LEFT,this.p.CENTER)
                this.p.textSize(this.radius * .6)
                this.p.text(
                    `x${this.combo.multiplicator}`,
                    this.x + this.radius * 1.6,
                    this.y
                )
            }
            const timeBar = this.p.map(
                this.party.time,
                this.combo.time,
                this.combo.time + this.comboTimeout,
                1, 0
            )
            const stateBar = Math.min(1,this.p.map(
                this.combo.hits,
                (this.combo.multiplicator - 1) * this.comboStateSize,
                this.combo.multiplicator * this.comboStateSize,
                0, 1
            ))
            this.p.noStroke()
            this.p.fill(
                this.p.map( timeBar, 0, 1, 255, 50 ),50,
                this.p.map( timeBar, 0, 1, 50, 255 ),200
            )
            this.p.rect(
                this.x + this.radius,
                this.y + this.radius * -.5 + this.p.map( timeBar, 0, 1, this.radius, 0 ),
                this.radius * .3,
                this.radius - this.p.map( timeBar, 0, 1, this.radius, 0 ),
                5
            )
            this.p.fill(200,50,200,200)
            this.p.rect(
                this.x + this.radius * .7,
                this.y + this.radius * -.5 + this.p.map( stateBar, 0, 1, this.radius, 0 ),
                this.radius * .3,
                this.radius - this.p.map( stateBar, 0, 1, this.radius, 0 ),
                5
            )

            this.p.noFill()
            this.p.stroke(this.app.light,200)
            this.p.strokeWeight(1)
            this.p.rect(
                this.x + this.radius * .7,
                this.y + this.radius * -.5,
                this.radius * .3,
                this.radius,
                5
            )
            this.p.rect(
                this.x + this.radius,
                this.y + this.radius * -.5,
                this.radius * .3,
                this.radius,
                5
            )
        }
        let flagIndex = 0
        for(const flag in this.temporary){
            if(this.getTemporary(flag)){
                const temp = this.temporary[flag]
                this.p.fill(0,100)
                this.p.stroke(this.app.light)
                this.p.strokeWeight(1)
                this.p.rect(
                    this.x - 40,
                    this.y - (64 + 14 * flagIndex),
                    80, 14, 5
                )
                this.p.noStroke()
                this.p.fill(255,0,190)
                this.p.rect(
                    (this.x - 40) + this.p.map( this.party.time, temp.triggerTime, temp.timeout, 0, 66 ),
                    this.y - (64 + 14 * flagIndex),
                    this.p.map( this.party.time, temp.triggerTime, temp.timeout, 66, 0 ),
                    14, 5
                )
                this.p.fill(200,100)
                this.p.rect(
                    this.x + 26,
                    this.y - (64 + 14 * flagIndex),
                    14, 14, 5
                )
                this.p.fill(255,0,190)
                temp.shape(
                    this.p,
                    this.x + 26,
                    this.y - (64 + 14 * flagIndex),
                    14, 14
                )
                flagIndex ++
            }
        }
        const bonusLength = this.consumables.length + this.passives.length
        if(bonusLength > 0){
            this.p.fill(0,100)
            this.p.stroke(this.app.light)
            this.p.strokeWeight(1)
            const width = bonusLength * 14
            this.p.rect(
                this.x - width * .5,
                this.y + 36,
                width, 14, 5
            )
            const bonus:any[] = [ ...this.consumables, ...this.passives ]
            bonus.forEach( (bonus, index) => {
                const max = bonus.level && bonus.level >= bonus.levelMax
                this.p.fill(200,100)
                max ? this.p.stroke(200, 200, 0,200) : this.p.noStroke()
                this.p.rect(
                    this.x - width * .5 + index * 14,
                    this.y + 36, 14, 14, 5
                )
                bonus.quantity ? this.p.fill(255,0,190) : this.p.fill(190,0,255)
                bonus.shape(
                    this.p,
                    this.x - width * .5 + index * 14,
                    this.y + 36, 14, 14
                )
                for(let i=0; i<(bonus.quantity||bonus.level); i++){
                    if(max) this.p.fill(200, 200, 0,200)
                    else bonus.quantity ? this.p.fill(255,0,190) : this.p.fill(190,0,255)
                    this.p.ellipse(
                        this.x - width * .5 + 7 + index * 14,
                        this.y + 57 + i * 14,5
                    )
                }
            })
        }

        if(this.app.debug){

        }

    }

    public keyPressed(key:string): void {
        this.app.keyMode.numeric.forEach( (keys, i) => {
            if(keys.includes(key) && this.consumables[i]){
                this.consumables[i].exec()
                this.consumables[i].quantity --
                if(this.consumables[i].quantity <= 0)
                    this.consumables = this.consumables.filter( c => {
                        return c.id !== this.consumables[i].id
                    })
            }
        })
    }

}
