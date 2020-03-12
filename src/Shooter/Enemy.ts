import Positionable from './Positionable';
import App from './App';
import Shoot from './Shoot';
import {isWhiteSpace} from "tslint";

export default abstract class Enemy extends Positionable {

    protected readonly MIN_RADIUS = 15
    protected baseGain:number
    protected baseLife:number
    protected baseSpeed:number
    protected baseDamage:number
    public abstract gain:number
    public abstract life:number
    public abstract speed:number
    public abstract damage:number
    public abstract immune:boolean
    public abstract id:string
    public abstract pattern():void
    public abstract onDraw():void
    public abstract onShoot(shoot:Shoot):boolean
    public abstract onPlayerContact():void

    protected constructor(
        public app:App
    ){
        super( app.p )
        this.reset()
    }

    public step(){

        if(!this.immune)
            for(const shoot of this.app.player.shoots)
                if(this.app.areOnContact(shoot,this))
                    if(this.onShoot(shoot))
                        if(shoot.handleShoot(this))
                            this.shoot(shoot)

        if(this.app.areOnContact(this,this.app.player))
            this.onPlayerContact()

        if(!this.isOutOfLimits())
            this.pattern()

    }

    public draw(){
        this.p.push()
        this.onDraw()
        this.p.pop()
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

    public reset(): void {
        if(
            this.baseGain &&
            this.baseLife &&
            this.baseSpeed &&
            this.baseDamage
        ){
            this.gain = this.baseGain
            this.life = this.baseLife
            this.speed = this.baseSpeed
            this.damage = this.baseDamage
        }
        this.placeOutOfViewport()
    }

    public get lifeBasedRadius(): number {
        return Math.max(
            this.MIN_RADIUS,
            Math.min(
                this.p.map(
                    this.life,
                    0,
                    this.baseLife,
                    0,
                    this.radius
                )
            )
        )
    }

}
