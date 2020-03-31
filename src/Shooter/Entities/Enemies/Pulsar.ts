import Enemy from '../Enemy';
import Shot from "../Shot";
import Party from '../Scenes/Party';
import {constrain, seconds} from '../../../utils';
import Rate from '../Rate';
import wave from '../../Animations/wave';
import Positionable from '../Positionable';

export default class Pulsar extends Enemy {

    public immune: boolean = false
    public speed: number = 3.5
    public damages: number = 2
    public gain: number = 1
    public life: number = 3
    public id = 'pulsar'

    private repulsiveWaveRate = new Rate(seconds(3))
    private repulsiveWaveDiameter = 400

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

    pattern(): void {
        this.follow(
            this.party.player,
            this.speed,
            3
        )
        if(this.repulsiveWaveRate.canTrigger(true)){
            this.party.setAnimation(wave({
                position: this,
                attach: true,
                value: this.repulsiveWaveDiameter,
                className: 'low',
                duration: 500
            }))
        }
        if(
            this.repulsiveWaveRate.triggeredForMoreThan(200) &&
            this.repulsiveWaveRate.triggeredForLessThan(600)
        ){
            for(const enemy of this.party.enemies)
                if(enemy.id !== 'pulsar' && this.calculatedDist(enemy) - this.radius < this.repulsiveWaveDiameter * .5)
                    enemy.repulseBy(this,enemy.speed, 10)
            for(const shot of this.party.player.shots)
                if(this.calculatedDist(shot) - this.radius < this.repulsiveWaveDiameter * .5)
                    shot.repulseBy(this,this.party.player.shotSpeed, 10)
            // TODO: slower.party.player.repulseBy(slower,slower.repulseSpeed)
        }
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
        this.p.fill(this.app.blue(.6))
        this.p.ellipse(
            this.x,
            this.y,
            this.diameter
        )
    }

    public get currentDiameter(){
        return this.lifeBasedDiameter
    }
}
