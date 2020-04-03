
import Shot from './Shot';
import {Combo, Consumable, Passive, ShapeFunction, TemporaryEffects} from '../../interfaces';
import Rate from './Rate';
import Party from './Scenes/Party';
import App from '../App';
import API from '../API';
import ellipseColorFadeOut from '../Animations/ellipseColorFadeOut';
import explosion from '../Animations/explosion';
import textFadeOut from '../Animations/textFadeOut';
import {constrain, map, norm, seconds} from '../../utils';
import Dirigible from './Dirigible';
import Angle from './Angle';
import Enemy from './Enemy';

export default class Player extends Dirigible {

    public baseLife = 5
    public life = 5
    public score = 0
    public baseSpeedMax = 10
    public baseShotSpeed = 10
    public baseShotRange = 250
    public baseShotDamage = 1
    public baseFireRate = 500
    public baseShotSize = 15
    public baseRotationSpeed = 45
    public speed = 0
    public acc = 3
    public desc = .7
    public angleMaxSpeedFraction = .7071067811865476
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
    private smokeRate = new Rate(300)

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
        return this.api.get<{score:number}>('score').then( data => {
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
        const shotSpeedUp = this.getPassive('shotSpeedUp')
        if(!shotSpeedUp) return this.baseShotSpeed
        return shotSpeedUp.value
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
    public get rotationSpeed(): number {
        const rotationSpeedUp = this.getPassive('rotationSpeedUp')
        if(!rotationSpeedUp) return this.baseRotationSpeed
        return rotationSpeedUp.value
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
                this.passives = this.passives.filter( p => p.id !== id )
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
            className: 'high',
            position: {
                x: 0,
                y: this.diameter * -1.8
            },
            attach: true,
            duration: 500,
            value: {
                text: `+ ${this.combo ? score * this.combo.multiplicator : score} pts`,
                color: this.p.color(this.app.white)
            }
        }))
    }

    public inflictDamages( damages:number ): void {
        this.party.setAnimation(ellipseColorFadeOut({
            className:'high',
            attach: true,
            duration: 150,
            position: this,
            value: this.party.time > this.immune ?
                this.p.color(255,0,0) :
                this.p.color(0,0,255)
        }))
        this.party.setAnimation(textFadeOut({
            attach: true,
            className: 'high',
            duration: 250,
            position: {
                x: 0,
                y: this.diameter * -1.8
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
        this.comboStep()
        if(await this.deathStep()) return
        this.moveStep()
        this.shotsStep()
    }

    public draw(): void {
        this.shots.forEach(shoot => shoot.draw() )
        if(this.killed) return
        this.drawPlayer()
        this.drawLifeBar()
        if(this.combo){
            this.drawMultiplicator()
            this.drawComboBars()
        }
        this.drawTemporaries()
        this.drawBonus()
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

    private comboStep(): void {
        if(this.combo && this.party.time > this.combo.time + this.comboTimeout)
            this.combo = null
    }

    private async deathStep(): Promise<boolean> {
        if(this.life <= 0){
            this.killed = true
            if(this.score > await this.getHighScore())
                this.setHighScore(this.score)
                    .catch(() => alert(`Error while saving your score :(`))
            this.party.setAnimation(explosion({
                value: this.diameter * 1.5,
                className: 'low',
                duration: 700,
                callback: a => {
                    a.scene.app.sceneName = a.scene.app.homeScene
                    a.scene.app.scenes.party.reset()
                }
            }))
            return true
        } return false
    }

    private moveStep(): void {

        let move = false

        if(this.app.mobile){
            if(!this.app.touchAngle){
                move = true
            }else{
                this.speed += this.acc
                this.angle.pointTo(this.app.touchAngle,this.rotationSpeed)
            }
        }else{
            if(!this.app.moveKeyIsPressed()){
                move = true
            }else{
                this.speed += this.acc
                this.angle.pointTo(Angle.fromDirectionalKeys(this.app,'move'),this.rotationSpeed)
            }
        }

        if(move){
            this.speed *= this.desc
        }else{
            if(this.smokeRate.canTrigger(true))
                this.party.setAnimation({
                    duration: this.smokeRate.interval,
                    value: this,
                    position: this.getVector(),
                    className: 'low',
                    draw: a => {
                        a.p.noFill()
                        a.p.strokeWeight(
                            a.map(3,1)
                        )
                        a.p.stroke(
                            a.scene.app.white,
                            a.map(100,0)
                        )
                        a.p.ellipse(
                            a.position.x,
                            a.position.y,
                            a.map(
                                a.value.diameter * .8,
                                a.value.diameter * .2
                            )
                        )
                    }
                })
        }

        if(this.speed < this.speedMax * -1) this.speed = this.speedMax * -1
        if(this.speed > this.speedMax) this.speed = this.speedMax

        if(this.speed < .1 && this.speed > -.1)
            this.speed = 0

        if(this.speed !== 0){
            const angleMove = this.getAngleMove(this.speed)
            this.party.move(
                angleMove.x,
                angleMove.y
            )
        }

    }

    private shotsStep(): void {
        this.shootRating.interval = this.fireRate
        if(this.shootRating.canTrigger()){
            if(this.getTemporary('starBalls')){
                if(this.app.shootKeyIsPressed() || this.app.mobile){
                    this.shootRating.trigger()
                    for(let i=0; i<8; i++)
                        this.shots.push(
                            new Shot(this,
                                (new Angle(
                                    this.p,
                                    45 * i
                                )).pointTo(
                                    this.angle,
                                    this.speed * 3,
                                    true
                                ).degrees
                            )
                        )
                }
            }else{
                if(this.app.mobile){
                    const enemies:{
                        enemy:Enemy
                        distance:number
                    }[] = []
                    for(const enemy of this.party.enemies)
                        if(!enemy.immune){
                            const distance = enemy.calculatedDist(this)
                            if(distance < this.shotRange)
                                enemies.push({ enemy, distance })
                        }
                    if(enemies.length > 0){
                        this.shootRating.trigger()
                        this.shots.push(
                            new Shot(this,
                                Angle.between(
                                    this.p,
                                    this,
                                    enemies.sort((a,b)=>{
                                        return a.distance - b.distance
                                    })[0].enemy
                                ).degrees
                            )
                        )
                    }
                }else{
                    if(this.app.shootKeyIsPressed()){
                        this.shootRating.trigger()
                        this.shots.push(
                            new Shot(this,
                                Angle.fromDirectionalKeys(
                                    this.app,
                                    'shoot'
                                ).pointTo(
                                    this.angle,
                                    this.speed * 3,
                                    true
                                ).degrees
                            )
                        )
                    }
                }
            }
        }
        this.shots = this.shots.filter(shoot => !shoot.isOutOfLimits() )
        this.shots.forEach(shoot => shoot.step() )
    }

    private drawPlayer(): void {
        const shield = this.getPassive('shield')
        if(shield){
            this.p.stroke(this.app.red(norm(shield.level,1,shield.levelMax)))
            this.p.strokeWeight(shield.level * 2)
        }else{
            if(this.app.lightMode) this.p.noStroke()
            else {
                this.p.stroke(0)
                this.p.strokeWeight(1)
            }
        }
        this.p.fill(this.app.light(.8))
        this.p.ellipse(this.x,this.y,this.diameter)
    }

    private drawLifeBar(): void {
        this.p.fill(0,100)
        this.p.stroke(this.app.white)
        this.p.strokeWeight(1)
        this.p.rect(this.x - 40,this.y - 50,80,14,5)
        this.p.noStroke()
        const color = this.app.blue(norm( this.life || this.baseLife, 0, this.baseLife ), .7)
        this.p.fill(color)
        this.p.rect(
            this.x - 40,
            this.y - 50,
            Math.max(0,this.p.map( this.life || this.baseLife, 0, this.baseLife, 0, 80 )),
            14, 5
        )
    }

    private drawMultiplicator(): void {
        this.p.fill(this.app.white,Math.min(255,this.p.map(
            this.party.time,
            this.combo.time,
            this.combo.time + this.comboTimeout,
            500,
            0
        )))
        this.p.noStroke()
        this.p.textAlign(this.p.LEFT,this.p.CENTER)
        this.p.textSize(
            this.diameter * .6 +
            constrain( map( this.party.time,
                this.combo.time,
                this.combo.time + 500,
                30,
                0
            ), 10, 30)
        )
        this.p.text(
            `x${this.combo.multiplicator}`,
            this.x + this.diameter * 1.6,
            this.y
        )
    }

    private drawComboBars(): void {
        const timeBar = norm(
            this.party.time,
            this.combo.time,
            this.combo.time + this.comboTimeout
        )
        const stateBar = Math.min(1, norm(
            this.combo.hits,
            (this.combo.multiplicator - 1) * this.comboStateSize,
            this.combo.multiplicator * this.comboStateSize
        ))
        this.p.noStroke()
        this.p.fill(this.app.red(timeBar,.7))
        this.p.rect(
            this.x + this.diameter,
            this.y + this.diameter * -.5 + this.p.map( timeBar, 1, 0, this.diameter, 0 ),
            this.diameter * .3,
            this.diameter - this.p.map( timeBar, 1, 0, this.diameter, 0 ),
            5
        )
        this.p.fill(this.app.light(.3, .7))
        this.p.rect(
            this.x + this.diameter * .7,
            this.y + this.diameter * -.5 + this.p.map( stateBar, 0, 1, this.diameter, 0 ),
            this.diameter * .3,
            this.diameter - this.p.map( stateBar, 0, 1, this.diameter, 0 ),
            5
        )

        this.p.noFill()
        this.p.stroke(this.app.white,200)
        this.p.strokeWeight(1)
        this.p.rect(
            this.x + this.diameter * .7,
            this.y + this.diameter * -.5,
            this.diameter * .3,
            this.diameter,
            5
        )
        this.p.rect(
            this.x + this.diameter,
            this.y + this.diameter * -.5,
            this.diameter * .3,
            this.diameter,
            5
        )
    }

    private drawTemporaries(): void {
        let flagIndex = 0
        for(const flag in this.temporary){
            if(this.getTemporary(flag)){
                const temp = this.temporary[flag]
                this.p.fill(0,100)
                this.p.stroke(this.app.white)
                this.p.strokeWeight(1)
                this.p.rect(
                    this.x - 40,
                    this.y - (64 + 14 * flagIndex),
                    80, 14, 5
                )
                this.p.noStroke()
                this.p.fill(this.app.red(.7))
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
                this.p.fill(this.app.red(.7))
                temp.shape(
                    this.p,
                    this.x + 26,
                    this.y - (64 + 14 * flagIndex),
                    14, 14
                )
                flagIndex ++
            }
        }
    }

    private drawBonus(): void {
        const bonusLength = this.consumables.length + this.passives.length
        if(bonusLength > 0){
            this.p.fill(0,100)
            this.p.stroke(this.app.white)
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
                bonus.quantity ? this.p.fill(this.app.red(.8)) : this.p.fill(this.app.blue(.8))
                bonus.shape(
                    this.p,
                    this.x - width * .5 + index * 14,
                    this.y + 36, 14, 14
                )
                for(let i=0; i<(bonus.quantity||bonus.level); i++){
                    if(max) this.p.fill(200, 200, 0,200)
                    else bonus.quantity ? this.p.fill(this.app.red(.7)) : this.p.fill(this.app.blue(.7))
                    this.p.ellipse(
                        this.x - width * .5 + 7 + index * 14,
                        this.y + 57 + i * 14,5
                    )
                }
            })
        }
    }
}
