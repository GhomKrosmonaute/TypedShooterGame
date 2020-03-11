import Enemy from '../Enemy';
import App from '../App';
import Shoot from "../Shoot";

export default class BlobEnemy extends Enemy {

    public immune: boolean = false
    public speed: number = 2
    public damage: number = 2
    public gain: number = 1
    public life: number = 2
    public maxLife: number = 10
    public id = 'blob'

    constructor( app:App ) {
        super( app )
        this.radius = 50
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamage = this.damage
    }

    pattern(): void {
        this.follow(
            this.app.player,
            this.speed
        )
        this.app.enemies.forEach( enemy => {
            if(
                !enemy.immune &&
                this !== enemy &&
                !enemy.isOutOfLimits() &&
                this.life >= enemy.life &&
                this.life + enemy.life < this.maxLife &&
                this.app.areOnContact( this, enemy )
            ){
                this.absorb(enemy)
                enemy.kill()
            }
        })
    }

    absorb( enemy:Enemy ){
        this.life += enemy.life
        this.damage += enemy.damage
        this.gain += enemy.gain
    }

    onPlayerContact(): void {
        const shield = this.app.player.getPassive('shield')
        if(!shield || shield.level < this.damage){
            this.app.player.removePassive('shield')
            this.app.player.life -= this.damage
        }
        this.kill(!!shield)
    }

    onShoot(shoot: Shoot): boolean {
        return true
    }

    onDraw(): void {
        this.p.noStroke()
        this.p.fill(
            Math.min(this.p.map(this.gain, 1, 10, 100, 255),255),
            80,
            Math.max(this.p.map(this.gain, 1, 10, 255, 100),100)
        )
        this.showIfNotOnScreen()
        this.p.ellipse(
            this.x,
            this.y,
            this.currentRadius
        )
    }

    public get currentRadius(){
        return Math.max(
            this.MIN_RADIUS,
            this.p.map(
                Math.min(this.life,this.baseLife),
                0,
                this.baseLife,
                0,
                this.radius
            ) + this.p.map(
                Math.max(this.baseLife,this.life),
                this.baseLife,
                this.maxLife,
                0,
                this.radius
            )
        )
    }

}
