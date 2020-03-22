import Enemy from '../Enemy';
import Shot from "../Shot";
import Party from '../Scenes/Party';
import p5 from 'p5';
import {explosion} from '../../../utils';

export default class Rocket extends Enemy {

    public gain: number = 0
    public life: number = 1
    public speed: number = 0
    public immune: boolean = true
    public damage: number = 3
    public id: string = 'rocket'

    private rotation = 0
    private rotationSpeed = 3
    private lockTime = Date.now() + 2000
    private damageTime = Date.now() + 3000
    private damageZone = 200
    private damageOccured = false

    constructor( party:Party ) {
        super( party )
        this.radius = 50
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamage = this.damage
    }

    pattern(): void {
        this.rotation += this.rotationSpeed
        if(this.rotation > 360)
            this.rotation -= 360
        if(Date.now() < this.lockTime){
            this.target(this.party.player,.15)
        }else{
            if(!this.damageOccured && Date.now() > this.damageTime){
                this.damageOccured = true
                if(this.dist(this.party.player) < this.damageZone){
                    this.party.player.life -= this.damage
                }
                this.app.setAnimation({
                    value: this.damageZone * 2,
                    position: { x:this.x, y:this.y },
                    duration: 100,
                    draw: explosion
                })
                this.kill()
            }
        }
    }

    onPlayerContact(): void {}

    onShoot(shoot: Shot): boolean {
        return false
    }

    onDraw(): void {
        let color:p5.Color
        this.p.translate(
            this.x,
            this.y
        )
        this.p.rotate(this.rotation)
        if(Date.now() < this.lockTime){
            color = this.p.color(255,0,0,100)
        }else{
            if(Date.now() < this.damageTime){
                color = this.p.color(255,0,0,this.p.map(
                    Date.now(),
                    this.lockTime,
                    this.damageTime,
                    100,
                    255
                ))
            }else{
                color = this.p.color(0,0)
            }
        }
        this.p.noFill()
        this.p.stroke(color)
        this.p.strokeWeight(this.radius * .2)
        this.p.ellipse(0,0,this.radius)
        this.p.fill(color)
        this.p.noStroke()
        this.p.angleMode(this.p.DEGREES);
        [90,90,90,90].forEach( angle => {
            this.p.rotate(angle)
            this.p.rect(
                this.radius * -.7,
                this.radius * -.1,
                this.radius * .4,
                this.radius * .2
            )
        })
        if(Date.now() > this.lockTime){
            color.setAlpha(Math.max(0,this.p.alpha(color) - 200))
            this.p.noFill()
            this.p.stroke(color)
            this.p.strokeWeight(10)
            this.p.ellipse(0,0,this.damageZone * 2)
        }
    }
}
