
import Enemy from '../Enemy';
import Party from '../Scenes/Party'
import Rate from '../Rate';
import {seconds} from '../../../utils';
import Dirigible from '../Dirigible';
import star from '../../Shapes/star';

export default class Freezer extends Enemy {

    public immune: boolean = false
    public speed: number = 2.2
    public damages: number = 1
    public gain: number = 1
    public life: number = 3
    public id = 'freezer'

    private readonly freezeRange = 500
    private readonly freezeRate = new Rate(seconds(1))
    private readonly freezeExplosionDuration = 300

    private freeze?:Dirigible
    private freezeExplosions:{
        x:number
        y:number
        time:number
    }[] = []

    constructor( party:Party ) {
        super( party )
        this.diameter = 80
        if(this.app.hardcore){
            this.speed ++
            this.life ++
        }
        this.baseGain = this.gain
        this.baseSpeed = this.speed
        this.baseLife = this.life
        this.baseDamages = this.damages
        this.overDraw = function(){
            if(this.freeze){
                this.p.fill(this.app.light(.5))
                this.p.noStroke()
                this.p.ellipse(
                    this.freeze.x,
                    this.freeze.y,
                    this.freeze.diameter
                )
            }
        }
    }

    public pattern(): void {
        this.follow(this.party.player, this.speed, 10)
        if(this.freeze && this.rawDist(this.freeze) > this.freezeRange)
            this.freeze = null
        if(this.freezeRate.canTrigger(true) && !this.freeze)
            this.launchFreeze()
        if(this.freeze){
            this.freeze.follow(
                this.party.player,
                this.app.hardcore ? this.speed + 3 : this.speed + 2,
                10
            )
            for(const enemy of this.party.enemies)
                if(this.freeze && !enemy.immune && enemy.id !== 'freezer' && enemy.calculatedTouch(this.freeze))
                    this.exploseFreeze()
            if(this.freeze && this.party.player.calculatedTouch(this.freeze))
                this.exploseFreeze()
        }
        this.freezeExplosions = this.freezeExplosions.filter( fe => fe.time < this.party.time + this.freezeExplosionDuration )
        for(const fe of this.freezeExplosions){
            for(const enemy of this.party.enemies)
                if(enemy.id !== 'freezer')
                    this.makeSlow(enemy)
        }

    }

    onPlayerContact(): void {
        this.checkShield()
    }

    public scroll(x: number, y: number): void {
        super.scroll(x, y)
        if(this.freeze) this.freeze.scroll(x,y)
    }

    public get currentDiameter(): number {
        return this.lifeBasedDiameter
    }

    public launchFreeze(): void {
        this.freeze = new Dirigible(
            this.p,
            this.x,
            this.y,
            this.diameter * .5,
            this.angle.clone()
        )
    }

    public exploseFreeze(): void {
        this.party.setAnimation({
            position: this.freeze,
            attach: true,
            duration: this.freezeExplosionDuration,
            value: null,
            className: 'low',
            draw: a => {

            }
        })
        this.freezeExplosions.push({
            x: this.freeze.x,
            y: this.freeze.y,
            time: this.party.time
        })
        this.freeze = null
    }

    public makeSlow( target:Dirigible ): void {

    }

}
