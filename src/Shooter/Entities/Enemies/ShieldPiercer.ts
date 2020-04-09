import Enemy from '../Enemy';
import Party from '../Scenes/Party'
import Shot from "../Shot";

export default class ShieldPiercer extends Enemy {

    public immune: boolean = false
    public damages: number = 1
    public speed: number = 4
    public gain: number = 1
    public life: number = 2
    public id = 'shieldPiercer'

    constructor( party:Party ) {
        super( party )
        this.diameter = 30
        if(this.app.hardcore){
            this.life += 2
            this.speed ++
            this.damages ++
        }
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamages = this.damages
    }

    public pattern(): void {
        this.follow(this.party.player, this.speed, 10)
    }

    onPlayerContact(): void {
        this.party.player.inflictDamages(this.damages)
        this.kill()
    }

    public get currentDiameter(){
        return this.lifeBasedDiameter
    }

}
