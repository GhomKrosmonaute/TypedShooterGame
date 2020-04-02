
import Enemy from '../Enemy';
import Party from '../Scenes/Party'
import Shot from "../Shot";
import Rate from '../Rate';
import Positionable from '../Positionable';
import {dist, random, map, seconds, norm} from '../../../utils';

export default class Freezer extends Enemy {

    public immune: boolean = false
    public speed: number = 2.5
    public damages: number = 1
    public gain: number = 1
    public life: number = 3
    public id = 'freezer'

    private freezeRange = 10
    private freezeRate = new Rate(seconds(2))
    private readonly freeze:Positionable

    constructor( party:Party ) {
        super( party )
        this.diameter = 40
        this.freeze = new Positionable(this.p,0,0,50)
        this.freeze.placeOutOfLimits()
        if(this.app.hardcore){
            this.speed ++
            this.life ++
        }
        this.baseGain = this.gain
        this.baseSpeed = this.speed
        this.baseLife = this.life
        this.baseDamages = this.damages
    }

    public pattern(): void {
        this.follow(this.party.player, this.speed, 10)
        if(this.freezeRate.canTrigger(true)){
            this.repopFreeze()
        }
        if(this.toFreeze()){
            for(const enemy of this.party.enemies) {
                if (enemy.id !== 'freezer' && enemy.calculatedTouch(this.freeze)) {
                    enemy.speed = Math.max(0,map(
                        enemy.rawDist(this.freeze),
                        this.freeze.radius / 2,
                        this.freeze.radius,
                        0,
                        enemy.baseSpeed
                    ))
                } else enemy.speed = enemy.baseSpeed
            }
        }
    }

    onPlayerContact(): void {
        this.checkShield()
    }

    shotFilter(shoot: Shot): boolean {
        return true
    }

    overDraw(): void {
        if(this.toFreeze()){
            const alpha = norm(Date.now(),this.freezeRate.endTime - this.freezeRate.interval * .5,this.freezeRate.triggerTime)
            this.p.noFill()
            this.p.stroke(this.app.light(.5,alpha))
            this.p.strokeWeight(3)
            this.p.ellipse(
                this.freeze.x,
                this.freeze.y,
                this.freeze.diameter
            )
        }
    }

    onDraw(): void {
        this.p.fill(this.app.blue(.8))
        this.p.stroke(this.app.light(.5))
        this.p.strokeWeight(3)
        const pos = this.constrain()
        this.p.ellipse(
            pos.x,
            pos.y,
            this.onScreenBasedDiameter
        )
    }

    public move(x: number, y: number): void {
        super.move(x, y)
        this.freeze.move(x,y)
    }

    public get currentDiameter(): number {
        return this.lifeBasedDiameter
    }

    public repopFreeze(): void {
        this.freeze.diameter = random(this.diameter * 2, this.diameter * 4)
        this.freeze.placeOutOfLimits()
        while(
            this.calculatedDist(this.freeze) < 0 ||
            this.calculatedDist(this.freeze) > this.freezeRange
        ) this.freeze.place({
            x: random(
                ((this.x - this.radius) - this.freeze.radius) - this.freezeRange,
                this.x + this.freeze.radius + this.radius + this.freezeRange
            ),
            y: random(
                ((this.y - this.radius) - this.freeze.radius) - this.freezeRange,
                this.y + this.freeze.radius + this.radius + this.freezeRange
            )
        })
    }

    private toFreeze(): boolean {
        return this.freezeRate.range(0,seconds(1))
    }

}
