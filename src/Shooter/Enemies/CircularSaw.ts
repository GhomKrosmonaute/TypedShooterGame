import Enemy from '../Enemy';
import App from '../App';
import Shot from "../Shot";
import {star} from "../../utils";

export default class CircularSaw extends Enemy {

    public gain: number = 0
    public life: number = 1
    public speed: number = 0
    public immune: boolean = true
    public damage: number = 5
    public id: string = 'circularSaw'

    private lastDamage = Date.now()
    private damageInterval = 1000
    private rotation = 0
    private rotationSpeed = 10

    constructor( app:App ) {
        super( app )
        this.radius = this.p.random(40,100)
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamage = this.damage
    }

    pattern(): void {
        this.rotation += this.rotationSpeed
        if(this.rotation > 360)
            this.rotation -= 360
    }

    onPlayerContact(): void {
        if(Date.now() > this.lastDamage + this.damageInterval){
            this.lastDamage = Date.now()
            this.app.player.life -= this.damage
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
