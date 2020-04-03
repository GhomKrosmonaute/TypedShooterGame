import Enemy from '../Enemy'
import Shot from "../Shot"
import Party from '../Scenes/Party'
import {seconds, map} from '../../../utils'
import Rate from '../Rate'
import wave from '../../Animations/wave'

export default class Pulsar extends Enemy {

    public immune: boolean = false
    public speed: number = 3.5
    public damages: number = 2
    public gain: number = 1
    public life: number = 3
    public id = 'pulsar'

    private waveRate = new Rate(seconds(3))
    private waveDiameter = 400

    constructor( party:Party ) {
        super( party )
        this.diameter = 60
        if(this.app.hardcore){
            this.life ++
            this.speed ++
        }
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamages = this.damages
    }

    private get waveRadius(): number {
        return this.waveDiameter * .5
    }

    pattern(): void {
        this.follow(
            this.party.player,
            this.speed,
            3
        )
        if(this.waveRate.canTrigger(true)){
            this.party.setAnimation(wave({
                position: this,
                attach: true,
                value: this.waveDiameter,
                className: 'low',
                duration: 500
            }))
        }
        if(this.waveRate.range(200,600)){
            for(const enemy of this.party.enemies) {
                const distance = this.calculatedDist(enemy) - this.radius
                if (enemy !== this && !enemy.immune && distance < this.waveRadius) {
                    const speed = map(distance,0,this.waveRadius,enemy.speed,0)
                    enemy.repulsedBy(this, speed, 10)
                }
            }
            for(const shot of this.party.player.shots) {
                const distance = this.calculatedDist(shot) - this.radius
                if (distance < this.waveRadius) {
                    const speed = map(distance,0,this.waveRadius,this.party.player.shotSpeed,0)
                    shot.repulsedBy(this, speed, 10)
                    // TODO: slower.party.player.repulseBy(slower,slower.repulseSpeed)
                    // TODO: convertir le player en dirigible et le faire avaner comme tel
                }
            }
        }
    }

    onPlayerContact(): void {
        this.checkShield()
    }

    overDraw(): void {
    }

    onDraw(): void {
        this.p.noStroke()
        this.p.fill(this.app.blue(.6))
        const pos = this.constrain()
        this.p.ellipse(
            pos.x,
            pos.y,
            this.onScreenBasedDiameter
        )
    }

    public get currentDiameter(){
        return this.lifeBasedDiameter
    }
}
