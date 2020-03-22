import Enemy from '../Enemy';
import Shot from "../Shot";
import {star} from "../../../utils";
import Party from '../Scenes/Party';

export default class CircularSaw extends Enemy {

    public gain: number = 0
    public life: number = 1
    public speed: number = 0
    public immune: boolean = true
    public damage: number = 5
    public id: string = 'circularSaw'

    private lastDamage:number
    private damageInterval = 1000
    private rotation = 0
    private rotationSpeed = 10

    constructor( party:Party ) {
        super( party )
        this.lastDamage = party.time
        this.radius = this.p.random(60,200)
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamage = this.damage
    }

    pattern(): void {
        this.rotation += this.rotationSpeed
        if(this.rotation > 360)
            this.rotation -= 360
        for(const enemy of this.party.enemies)
            if(!enemy.immune && this.party.app.areOnContact(this,enemy))
                enemy.kill()
    }

    onPlayerContact(): void {
        if(this.party.time > this.lastDamage + this.damageInterval){
            this.lastDamage = this.party.time
            this.party.player.life -= this.damage
        }
    }

    onShoot(shoot: Shot): boolean {
        return false
    }

    onDraw(): void {
        this.p.noStroke()
        this.p.fill(130)
        this.p.translate(
            this.x,
            this.y
        )
        this.p.rotate(this.rotation)
        star(
            this.p,
            0,
            0,
            this.radius * .4,
            this.radius,
            12
        )
        this.p.strokeWeight(3)
        this.p.fill(80)
        this.p.stroke(200,0,100)
        this.p.ellipse(
            0,
            0,
            this.radius * .7
        )
    }

}
