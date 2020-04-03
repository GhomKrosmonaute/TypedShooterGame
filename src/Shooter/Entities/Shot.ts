import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
import {fade} from '../../utils';
import explosion from '../Animations/explosion';
import {Vector2D} from '../../interfaces';
import Dirigible from './Dirigible';
import Angle from './Angle';

export default class Shot extends Dirigible {

    public readonly basePosition:Dirigible
    private readonly speed:number
    public readonly damage:number
    private piercingShots:number = 1
    private toIgnore:Enemy[] = []

    constructor(
        public player:Player,
        degrees:number
    ){
        super(
            player.p,
            player.x,
            player.y,
            player.shotSize,
            new Angle(player.p,degrees)
        )
        this.basePosition = new Dirigible( this.p,
            player.x * 10,
            player.y * 10,
            0,
            player.angle
        )
        this.basePosition.moveByAngle(player.speed * 2)
        this.speed = this.player.shotSpeed
        this.damage = this.player.shotDamage
        const piercingShots = this.player.getPassive('piercingShots')
        if(piercingShots) this.piercingShots += piercingShots.level
    }

    public handleShoot( enemy:Enemy ): boolean {
        if(!this.toIgnore.includes(enemy)){
            this.piercingShots --
            this.toIgnore.push(enemy)
            if(this.piercingShots === 0)
                this.terminate()
            return true
        }
        return false
    }

    public terminate(): void {
        const explosiveShots = this.player.getPassive('explosiveShots')
        if(explosiveShots){
            this.player.party.setAnimation(explosion({
                className: 'low',
                duration: 100,
                position: { x: this.x, y: this.y },
                value: explosiveShots.value * 2
            }))
            for(const enemy of this.player.party.enemies)
                if(this.rawDist(enemy) < explosiveShots.value)
                    enemy.inflictDamages(this.damage,true)
        }
        this.placeOutOfLimits()
    }

    public step(): void {
        if(this.rawDist(this.basePosition) > this.player.shotRange){
            this.terminate()
        }else{
            const autoFireGuidance = this.player.getPassive('autoFireGuidance')
            let target:Vector2D
            if(autoFireGuidance){
                const temp:{
                    enemy: Enemy
                    dist: number
                } = {
                    enemy: null,
                    dist: Infinity
                }
                for(const enemy of this.player.party.enemies){
                    if(!this.toIgnore.includes(enemy) && !enemy.immune){
                        const dist = enemy.rawDist(this)
                        if(dist < autoFireGuidance.value && temp.dist > dist){
                            temp.enemy = enemy
                            temp.dist = dist
                        }
                    }
                }
                target = temp.enemy
            }
            if(target) this.follow(
                target,
                this.speed,
                this.speed * 2
            ); else this.moveByAngle(this.speed)
        }
    }

    public draw(): void {
        if(this.isOnScreen()){
            this.p.push()
            this.p.translate(this.x,this.y)
            this.p.angleMode(this.p.DEGREES)
            this.p.rotate(this.angle.degrees + 180)
            this.p.tint(255)
            this.p.image(
                this.player.app.images.shot,
                this.radius * -1,
                this.radius * -1,
                this.diameter,
                this.diameter
            )
            this.p.pop()
        }
    }
}
