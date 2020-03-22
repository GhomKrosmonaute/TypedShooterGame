import Positionable from './Positionable';
import App from '../App';
import Shot from './Shot'
import p5 from "p5";
import {Vector2D} from "../../interfaces";
import Party from './Scenes/Party';
import {explosion} from '../../utils';

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
    public abstract onShoot(shoot:Shot):boolean
    public abstract onPlayerContact():void
    public app:App

    private lastDeadChain = 0

    protected constructor(
        public party:Party
    ){
        super( party.p )
        this.app = party.app
        this.reset()
    }

    public step(){

        if(!this.immune)
            for(const shoot of this.party.player.shots)
                if(this.app.areOnContact(shoot,this))
                    if(this.onShoot(shoot))
                        if(shoot.handleShoot(this))
                            this.inflictDamages(shoot.damage,true)

        if(this.app.areOnContact(this,this.party.player))
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

        const position:Vector2D = { x:this.x, y:this.y }

        const deadChain = this.party.player.getPassive('deadChain')
        if(addToScore && deadChain){
            setTimeout(() => {
                for(const enemy of this.party.enemies)
                    if (
                        enemy !== this &&
                        this.party.time > enemy.lastDeadChain + 2000 &&
                        enemy.life > 0 &&
                        !enemy.immune &&
                        enemy.dist(position) < deadChain.value
                    ) {
                        enemy.inflictDamages(this.baseLife * .5, true)
                        enemy.lastDeadChain = this.party.time
                    }
            },200)
        }

        this.party.setAnimation({
            position,
            duration: 200,
            value: addToScore && deadChain ? deadChain.value * 2 : this.radius,
            draw: explosion
        })

        if(addToScore) this.party.player.addScore(this.gain)
        this.reset()
    }

    public inflictDamages( damages:number, addToScore:boolean = false ): void {
        if(this.immune) return
        this.life -= damages
        if(this.life <= 0) {
            this.kill(addToScore)
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
