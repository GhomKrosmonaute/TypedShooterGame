import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
import {fade} from '../../utils';
import explosion from '../Animations/explosion';
import {Vector2D} from '../../interfaces';

export default class Shot extends Positionable {

    public readonly basePosition:Positionable
    public readonly direction:Positionable
    private readonly speed:number
    public readonly damage:number
    private piercingShots:number = 1
    private toIgnore:Enemy[] = []

    constructor(
        public player:Player,
        directionX:number,
        directionY:number
    ){
        super( player.p, player.x, player.y, player.shotSize )
        this.direction = new Positionable( this.p,
            directionX * 5000,
            directionY * 5000
        )
        this.basePosition = new Positionable( this.p,
            player.x + player.speedX * 10,
            player.y + player.speedY * 10
        )
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
            if(target){
                this.follow(target,this.speed)
            }else{
                this.follow(this.direction,this.speed)
            }
        }
    }

    public draw(): void {
        if(this.isOnScreen()){
            if(this.player.party.app.lightMode)
                this.p.noStroke()
            else {
                this.p.stroke(0)
                this.p.strokeWeight(1)
            }
            this.p.fill(200,200,255)
            this.p.ellipse(
                this.x,
                this.y,
                fade( this.diameter,
                    {
                        value: this.rawDist(this.player),
                        valueMax: this.player.shotRange,
                        overflow: 5
                    },
                    {
                        value: this.rawDist(this.basePosition),
                        valueMax: this.player.shotRange,
                        overflow: 5
                    }
                )
            )
        }
    }
}
