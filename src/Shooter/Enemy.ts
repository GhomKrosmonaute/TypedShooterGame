import Positionable from './Positionable';
import App from './App';
import Shoot from './Shoot';
import {isWhiteSpace} from "tslint";

export default abstract class Enemy extends Positionable {

    protected baseGain:number
    protected baseLife:number
    protected baseSpeed:number
    public abstract gain:number
    public abstract life:number
    public abstract speed:number
    public abstract pattern():void

    protected constructor(
        public app:App
    ){
        super( app.p, 0, 0, 40 )
        this.reset()
    }

    public step(){
        this.app.player.shoots.forEach( shoot => {
            if(this.app.areOnContact(shoot,this))
                if(shoot.handleShoot(this))
                    this.shoot(shoot)
        })
        if(this.app.areOnContact(this,this.app.player)){
            if(this.constructor.name === 'AyaEnemy'){
                this.app.player.life -= this.life
                this.kill()
            }else{
                const shield = this.app.player.getPassive('shield')
                if(!shield || shield.level < this.life){
                    this.app.player.life -= this.life
                }
                this.kill(!!shield)
            }

        }
        if(!this.isOutOfLimits())
            this.pattern()
    }

    public draw(){
        this.p.fill(
            Math.min(this.p.map(this.gain, 1, 10, 100, 255),255),
            80,
            Math.max(this.p.map(this.gain, 1, 10, 255, 100),100)
        )
        if(!this.isOnScreen()){
            this.p.ellipse(
                this.x > this.p.width * .5 ? this.p.width * .5 : this.x < this.p.width * -.5 ? this.p.width * -.5 : this.x,
                this.y > this.p.height * .5 ? this.p.height * .5 : this.y < this.p.height * -.5 ? this.p.height * -.5 : this.y,
                (this.currentRadius + 1) / 3
            )
        }
        this.p.ellipse(
            this.x,
            this.y,
            this.currentRadius
        )

    }

    public kill( addToScore:boolean = false ): void {
        if(addToScore) this.app.player.score += this.gain
        this.reset()
    }

    public shoot( shoot:Shoot ): void {
        this.life -= shoot.damage
        if(this.life <= 0) {
            this.kill(true)
        }
    }

    public get currentRadius(){
        const bonusLife = this.life - this.baseLife
        return Math.max(
            this.radius / 2,
            Math.min(
                this.p.map(
                    this.life,
                    0,
                    this.baseLife,
                    0,
                    this.radius
                ),
                bonusLife > 0 ? this.radius + bonusLife * 2 : this.radius
            )
        )
    }

    public reset(): void {
        if(
            this.baseGain &&
            this.baseLife &&
            this.baseSpeed
        ){
            this.gain = this.baseGain
            this.life = this.baseLife
            this.speed = this.baseSpeed
        }
        while(this.isOnScreen()){
            this.x = this.p.random( this.p.width * -1.5, this.p.width * 1.5 )
            this.y = this.p.random( this.p.height * -1.5, this.p.height * 1.5 )
        }
    }

}
