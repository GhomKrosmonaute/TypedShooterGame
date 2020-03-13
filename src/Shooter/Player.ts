import App from './App';
import Positionable from './Positionable';
import Shot from './Shot';
import {Consumable, Passive, ShapeFunction, TemporaryEffects} from '../interfaces';
import Rate from './Rate';

export default class Player extends Positionable {

    public baseLife = 5
    public life = 5
    public score = 0
    public baseShotSpeed = 10
    public baseShotRange = 300
    public baseShotDamage = 1
    public baseFireRate = 500
    public baseShotSize = 15
    public speedX = 0
    public speedY = 0
    public speedMax = 10
    public acc = 3
    public desc = .7
    public highScore:number = JSON.parse(localStorage.getItem('shooter')).highScore
    public consumables:Consumable[] = []
    public passives:Passive[] = []
    public shots:Shot[] = []
    public temporary:TemporaryEffects = {}

    public shootRating:Rate

    constructor(
        public app:App
    ){
        super( app.p, 0, 0, 50 )
        this.shootRating = new Rate(this.baseFireRate)
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
            this.temporary[flag].timeout < Date.now()
        )
            this.temporary[flag] = { shape,
                triggerTime: Date.now(),
                timeout: Date.now() + duration
            }
        else this.temporary[flag].timeout += duration
    }

    public getTemporary( flag:string ): boolean {
        if(!this.temporary[flag]) return false
        return this.temporary[flag].timeout > Date.now()
    }

    public addPassive( passive:Passive ): void {
        const exists = this.passives.find( p => p.id === passive.id )
        if(exists){
            exists.level ++
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
        const exists = this.consumables.find( c => c.id === consumable.id )
        if(exists){
            exists.quantity ++
        }else{
            this.consumables.push(consumable)
        }
    }

    public step(): void {

        // DEATH ?

        if(this.life <= 0){
            if(this.score > this.highScore){
                const storage = JSON.parse(localStorage.getItem('shooter'))
                storage.highScore = this.score
                localStorage.setItem('shooter',JSON.stringify(storage))
            }
            this.app.reset()
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
        this.app.move(
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

    public draw(): void {
        this.shots.forEach(shoot => shoot.draw() )
        this.p.noStroke()
        this.p.fill(this.app.light)
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
            this.p.map( this.life || this.baseLife, 0, this.baseLife, 0, 80 ),
            14, 5
        )
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
                    (this.x - 40) + this.p.map( Date.now(), temp.triggerTime, temp.timeout, 0, 66 ),
                    this.y - (64 + 14 * flagIndex),
                    this.p.map( Date.now(), temp.triggerTime, temp.timeout, 66, 0 ),
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
            this.p.noStroke()
            const bonus:any[] = [ ...this.consumables, ...this.passives ]
            bonus.forEach( (bonus, index) => {
                this.p.fill(200,100)
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

}
