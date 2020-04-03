import Enemy from '../Enemy';
import Shot from "../Shot";
import Party from '../Scenes/Party';
import p5 from 'p5';
import explosion from '../../Animations/explosion';

export default class Rocket extends Enemy {

    public gain: number = 0
    public life: number = 1
    public speed: number = 0
    public immune: boolean = true
    public damages: number = 2
    public id: string = 'rocket'

    private rotation = 0
    private rotationSpeed = 3
    private readonly lockTime:number
    private readonly damageTime:number
    private damageZone = 200
    private damageOccured = false

    constructor( party:Party ) {
        super( party )
        this.lockTime = party.time + 1000
        this.damageTime = party.time + (this.app.hardcore ? 1500 : 2000)
        this.diameter = 50
        if(this.app.hardcore) this.damages ++
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamages = this.damages
    }

    pattern(): void {
        this.rotation += this.rotationSpeed
        if(this.rotation > 360)
            this.rotation -= 360
        if(this.party.time < this.lockTime){
            this.target(this.party.player,.15)
        }else{
            if(!this.damageOccured && this.party.time > this.damageTime){
                this.damageOccured = true

                for(const enemy of this.party.enemies)
                    if(this.rawDist(enemy) < this.damageZone)
                        enemy.inflictDamages(this.damages)

                if(this.rawDist(this.party.player) < this.damageZone)
                    this.party.player.inflictDamages(this.damages)

                this.party.setAnimation(explosion({
                    className: 'low',
                    value: this.damageZone * 2,
                    position: { x:this.x, y:this.y },
                    duration: 100
                }))
                this.kill()
            }
        }
    }

    onPlayerContact(): void {}

    overDraw(): void {
    }

    onDraw(): void {
        let color:p5.Color
        this.p.translate(
            this.x,
            this.y
        )
        this.p.angleMode(this.p.DEGREES)
        this.p.rotate(this.rotation)
        if(this.party.time < this.lockTime){
            color = this.p.color(255,0,0,100)
        }else{
            if(this.party.time < this.damageTime){
                color = this.p.color(255,0,0,this.p.map(
                    this.party.time,
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
        this.p.strokeWeight(this.diameter * .2)
        this.p.ellipse(0,0,this.diameter)
        this.p.fill(color)
        this.p.noStroke();
        [90,90,90,90].forEach( angle => {
            this.p.rotate(angle)
            this.p.rect(
                this.diameter * -.7,
                this.diameter * -.1,
                this.diameter * .4,
                this.diameter * .2
            )
        })
        if(this.party.time > this.lockTime){
            color.setAlpha(Math.max(0,this.p.alpha(color) - 200))
            this.p.noFill()
            this.p.stroke(color)
            this.p.strokeWeight(10)
            this.p.ellipse(0,0,this.damageZone * 2)
        }
    }
}
