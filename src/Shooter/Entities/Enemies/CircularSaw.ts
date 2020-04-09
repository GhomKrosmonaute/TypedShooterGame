import Enemy from '../Enemy';
import Shot from "../Shot";
import Party from '../Scenes/Party';
import star from '../../Shapes/star';

export default class CircularSaw extends Enemy {

    public gain: number = 0
    public life: number = 1
    public speed: number = 0
    public immune: boolean = true
    public damages: number = 5
    public id: string = 'circularSaw'

    private lastDamage:number
    private damageInterval = 1000
    private rotation = 0
    private rotationSpeed = 10

    constructor( party:Party ) {
        super( party )
        this.lastDamage = party.time
        this.diameter = this.p.random(60,500)
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamages = this.damages
        this.onDraw = function(){
            this.p.noStroke()
            this.p.fill(130)
            this.p.translate(
                this.x,
                this.y
            )
            this.p.angleMode(this.p.DEGREES)
            this.p.rotate(this.rotation)
            star(
                this.p,
                0,
                0,
                this.diameter * .2,
                this.radius,
                12
            )
            this.p.fill(80)
            this.p.strokeWeight(3)
            this.p.stroke(this.app.red(.7))
            this.p.ellipse(
                0,
                0,
                this.radius
            )
        }
    }

    pattern(): void {
        this.rotation += this.rotationSpeed
        if(this.rotation > 360)
            this.rotation -= 360
        for(const enemy of this.party.enemies)
            if(!enemy.immune && this.calculatedTouch(enemy))
                enemy.kill()
        for(const bonus of this.party.bonus)
            while(this.calculatedTouch(bonus))
                bonus.placeOutOfViewport(true)
    }

    onPlayerContact(): void {
        if(this.party.time > this.lastDamage + this.damageInterval){
            this.lastDamage = this.party.time
            this.checkShield()
        }
    }

}
