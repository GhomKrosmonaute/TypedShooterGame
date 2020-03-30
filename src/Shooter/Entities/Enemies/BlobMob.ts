import Enemy from '../Enemy';
import Shot from "../Shot";
import Party from '../Scenes/Party';
import {constrain} from '../../../utils';

export default class BlobMob extends Enemy {

    public immune: boolean = false
    public speed: number = 3
    public damages: number = 2
    public gain: number = 1
    public life: number = 2
    public maxLife: number = 10
    public id = 'blob'

    constructor( party:Party ) {
        super( party )
        this.diameter = 50
        if(this.app.hardcore){
            this.damages ++
            this.life += 2
            this.speed ++
        }
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamages = this.damages
    }

    pattern(): void {
        this.follow(
            this.party.player,
            this.speed,
            10
        )
        this.party.enemies.forEach( enemy => {
            if(
                !enemy.immune &&
                this !== enemy &&
                !enemy.isOutOfLimits() &&
                this.life >= enemy.life &&
                this.life + enemy.life < this.maxLife &&
                this.calculatedTouch(enemy)
            ){
                this.absorb(enemy)
                enemy.kill()
            }
        })
    }

    absorb( enemy:Enemy ){
        this.life += enemy.life
        this.gain += enemy.gain
        this.damages += enemy.damages
    }

    onPlayerContact(): void {
        this.checkShield()
    }

    shotFilter(shoot: Shot): boolean {
        return true
    }

    overDraw(): void {
    }

    onDraw(): void {
        this.p.noStroke()
        this.p.fill(this.app.red(constrain(this.p.map(this.gain, 1, 10, .2, .8),.2,.8)))
        this.p.ellipse(
            this.x,
            this.y,
            this.currentDiameter
        )
    }

    public get currentDiameter(): number {
        return Math.max(
            this.MIN_DIAMETER,
            this.p.map(
                Math.min(this.life,this.baseLife),
                0,
                this.baseLife,
                0,
                this._diameter
            ) + this.p.map(
                Math.max(this.baseLife,this.life),
                this.baseLife,
                this.maxLife,
                0,
                this._diameter
            )
        )
    }

}
