import App from './App';
import Positionable from './Positionable';
import Shoot from './Shoot';
import {Consumable, Passive, PowaKeys, ShapeFunction, TemporaryEffects} from '../interfaces';
import Rate from './Rate';

export default class Player extends Positionable {

    public lifeMax = 5
    public score = 0
    public shootspeed = 15
    public shootrange = 400
    public shootdamage = 1
    public speedX = 0
    public speedY = 0
    public speedMax = 10
    public acc = 3
    public desc = .7
    public highscore:number = JSON.parse(localStorage.getItem('shooter')).highscore
    public life:number
    public consumables:Consumable[] = []
    public passives:Passive[] = []
    public shoots:Shoot[] = []
    public temporary:TemporaryEffects = {}

    private shootrate = new Rate(500)

    constructor(
        public app:App
    ){
        super( app.p, 0, 0, 50 )
        this.life = this.lifeMax
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
        const exists = this.passives.find( p => {
            return p.constructor.name === passive.constructor.name
        })
        if(exists){
            exists.level ++
        }else{
            this.passives.push(passive)
        }
    }

    public addConsumable( consumable:Consumable ): void {
        const exists = this.consumables.find( c => {
            return c.constructor.name === consumable.constructor.name
        })
        if(exists){
            exists.quantity ++
        }else{
            this.consumables.push(consumable)
        }
    }

    public step(): void {

        // MORT ?

        if(this.life <= 0){
            if(this.score > this.highscore){
                const storage = JSON.parse(localStorage.getItem('shooter'))
                storage.highscore = this.score
                localStorage.setItem('shooter',JSON.stringify(storage))
            }
            this.app.reset()
        }

        // DEPLACEMENTS

        const keys = this.app.keys

        if(this.app.moveKeysIsNotPressed()){

            this.speedX *= this.desc
            this.speedY *= this.desc

        }else{

            if(!keys.ArrowLeft && !keys.ArrowRight)
                this.speedX *= this.desc

            if(!keys.ArrowUp && !keys.ArrowDown)
                this.speedY *= this.desc

            if(keys.ArrowLeft) this.speedX -= this.acc
            if(keys.ArrowRight) this.speedX += this.acc
            if(keys.ArrowUp) this.speedY -= this.acc
            if(keys.ArrowDown) this.speedY += this.acc

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

        if(this.shootrate.canTrigger()){
            const { map } = this.p
            const direction = {
                x: map(this.speedX * .5, this.speedMax * -.5, this.speedMax * .5, -.5, .5),
                y: map(this.speedY * .5, this.speedMax * -.5, this.speedMax * .5, -.5, .5)
            }
            if(this.getTemporary('star')){
                if(!this.app.shootKeysIsNotPressed()){
                    this.shootrate.trigger()
                    this.shoots.push(
                        new Shoot( this,1 + direction.x,direction.y),
                        new Shoot( this,-1 + direction.x,direction.y),
                        new Shoot( this,direction.x,1 + direction.y),
                        new Shoot( this,direction.x,-1 + direction.y),
                        new Shoot( this,1 + direction.x,1 + direction.y),
                        new Shoot( this,-1 + direction.x,1 + direction.y),
                        new Shoot( this,1 + direction.x,-1 + direction.y),
                        new Shoot( this,-1 + direction.x,-1 + direction.y)
                    )
                }
            }else{
                if(keys.z) direction.y -= 1
                if(keys.q) direction.x -= 1
                if(keys.s) direction.y += 1
                if(keys.d) direction.x += 1
                if(!this.app.shootKeysIsNotPressed()){
                    this.shootrate.trigger()
                    this.shoots.push( new Shoot( this,
                        direction.x,
                        direction.y
                    ))
                }
            }

        }

        this.shoots = this.shoots.filter( shoot => !shoot.isOutOfLimits() )
        this.shoots.forEach( shoot => shoot.step() )

    }

    public keyPressed(key:string): void {
        PowaKeys.forEach( (pk,i) => {
            if(key === pk && this.consumables[i]){
                this.consumables[i].exec()
                this.consumables[i].quantity --
                if(this.consumables[i].quantity <= 0)
                    this.consumables = this.consumables.filter( c => {
                        return c.constructor.name !== this.consumables[i].constructor.name
                    })
            }
        })
    }

    public draw(): void {
        const { fill, ellipse, stroke, strokeWeight, rect, noStroke, map } = this.p
        this.shoots.forEach( shoot => shoot.draw() )
        fill(255)
        ellipse(this.x,this.y,this.radius)
        fill(0,100)
        stroke(255)
        strokeWeight(1)
        rect(this.x - 40,this.y - 50,80,14,5)
        noStroke()
        fill(
            map( this.life, 0, this.lifeMax, 255, 50 ),
            map( this.life, 0, this.lifeMax, 50, 255 ),
            50, 200
        )
        rect(
            this.x - 40,
            this.y - 50,
            map( this.life, 0, this.lifeMax, 0, 80 ),
            14, 5
        )
        let flagIndex = 0
        for(const flag in this.temporary){
            if(this.getTemporary(flag)){
                const temp = this.temporary[flag]
                fill(0,100)
                stroke(255)
                strokeWeight(1)
                rect(
                    this.x - 40,
                    this.y - (64 + 14 * flagIndex),
                    80, 14, 5
                )
                noStroke()
                fill(255,0,190)
                rect(
                    (this.x - 40) + map( Date.now(), temp.triggerTime, temp.timeout, 0, 66 ),
                    this.y - (64 + 14 * flagIndex),
                    map( Date.now(), temp.triggerTime, temp.timeout, 66, 0 ),
                    14, 5
                )
                fill(200,100)
                rect(
                    this.x + 26,
                    this.y - (64 + 14 * flagIndex),
                    14, 14, 5
                )
                fill(255,0,190)
                temp.shape(
                    this.x + 26,
                    this.y - (64 + 14 * flagIndex),
                    14, 14
                )
                flagIndex ++
            }
        }
        const bonusLength = this.consumables.length + this.passives.length
        if(bonusLength > 0){
            fill(0,100)
            stroke(255)
            strokeWeight(1)
            const width = bonusLength * 14
            rect(
                this.x - width * .5,
                this.y + 36,
                width, 14, 5
            )
            noStroke()
            const bonus:any[] = [ ...this.consumables, ...this.passives ]
            bonus.forEach( (bonus, index) => {
                fill(200,100)
                rect(
                    this.x - width * .5 + index * 14,
                    this.y + 36, 14, 14, 5
                )
                bonus.quantity ? fill(255,0,190) : fill(190,0,255)
                bonus.shape(
                    this.x - width * .5 + index * 14,
                    this.y + 36, 14, 14
                )
                for(let i=0; i<(bonus.quantity||bonus.level); i++){
                    ellipse(
                        this.x - width * .5 + 7 + index * 14,
                        this.y + 57 + i * 14,5
                    )
                }
            })
        }

    }

}
