import Enemy from '../Enemy';
import Party from '../Scenes/Party'
import Shot from "../Shot";

export default class ShieldPiercer extends Enemy {

    public immune: boolean = false
    public damage: number = 1
    public speed: number = 4
    public gain: number = 1
    public life: number = 2
    public id = 'shieldPiercer'

    constructor( party:Party ) {
        super( party )
        this.radius = 30
        if(this.app.hardcore){
            this.life += 2
            this.speed ++
            this.damage ++
        }
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamage = this.damage
    }

    public pattern(): void {
        this.follow(this.party.player, this.speed)
    }

    onPlayerContact(): void {
        this.party.player.inflictDamages(this.damage)
        this.kill()
    }

    onShoot(shoot: Shot): boolean {
        return true
    }

    onDraw(): void {
        this.p.fill(255,0,255)
        this.showIfNotOnScreen()
        this.p.ellipse(
            this.x,
            this.y,
            this.currentRadius
        )
    }

    public get currentRadius(){
        return this.lifeBasedRadius
    }

}
