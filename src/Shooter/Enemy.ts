import Positionable from './Positionable';
import App from './App';
import Shot from './Shot'
import p5 from "p5";
import {Vector2D} from "../interfaces";

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

    protected constructor(
        public app:App
    ){
        super( app.p )
        this.reset()
    }

    public step(){

        if(!this.immune)
            for(const shoot of this.app.player.shots)
                if(this.app.areOnContact(shoot,this))
                    if(this.onShoot(shoot))
                        if(shoot.handleShoot(this))
                            this.inflictDamages(shoot.damage,true)

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

        const position:Vector2D = { x:this.x, y:this.y }

        const deadChain = this.app.player.getPassive('deadChain')
        if(addToScore && deadChain){

            setTimeout(() => {
                for(const enemy of this.app.enemies)
                    if (
                        enemy !== this &&
                        enemy.life > 0 &&
                        !enemy.immune &&
                        enemy.dist(position) < deadChain.value
                    ) enemy.inflictDamages(this.baseLife, true)
            },200)

            this.app.setAnimation({
                duration: 200,
                value: {position,deadChain},
                draw(p: p5, time: number, values: any ): void {
                    const opacity = p.map(time,0,200,255,0)
                    p.noStroke()
                    p.fill(255,0,0, opacity)
                    p.ellipse(values.position.x,values.position.y,p.map(time,0,200,values.deadChain.value,1))
                    p.noFill()
                    p.stroke(255, opacity)
                    p.strokeWeight(p.map(time,0,200,1,10))
                    p.ellipse(values.position.x,values.position.y,p.map(time,0,200,1,values.deadChain.value))
                }
            })

        }else{
            this.app.setAnimation({
                duration: 200,
                value: {radius:this.radius,position},
                draw(p: p5, time: number, values:any ): void {
                    const opacity = p.map(time,0,200,255,0)
                    p.noStroke()
                    p.fill(200,0,100, opacity)
                    p.ellipse(values.position.x,values.position.y,p.map(time,0,200, values.radius,1))
                    p.noFill()
                    p.stroke(255, opacity)
                    p.strokeWeight(p.map(time,0,200,1,5))
                    p.ellipse(values.position.x,values.position.y,p.map(time,0,200, 1,values.radius))
                }
            })
        }

        if(addToScore) this.app.player.score += this.gain
        this.reset()
    }

    public inflictDamages( damages:number, addToScore:boolean = false ): void {
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
