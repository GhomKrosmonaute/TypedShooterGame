import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
import {fade} from "../../utils";

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
                this.placeOutOfLimits()
            return true
        }
        return false
    }

    public step(): void {
        if(this.dist(this.basePosition) > this.player.shotRange){
            this.placeOutOfLimits()
        }else{
            const autoFireGuidance = this.player.getPassive('autoFireGuidance')
            let target:Enemy = null
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
                        const dist = enemy.dist(this)
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
        this.p.noStroke()
        this.p.fill(this.player.app.light)
        this.p.ellipse(
            this.x,
            this.y,
            fade( this.p, this.radius,
                {
                    value: this.dist(this.player),
                    valueMax: this.player.shotRange,
                    overflow: 5
                },
                {
                    value: this.dist(this.basePosition),
                    valueMax: this.player.shotRange,
                    overflow: 5
                }
            )
        )
        if(this.player.app.debug){
            this.p.strokeWeight(1)
            this.p.noFill()
            this.p.stroke(255,0,0)
            this.p.ellipse(
                this.basePosition.x,
                this.basePosition.y,
                this.player.shotRange * 2
            )
            const autoFireGuidance = this.player.getPassive('autoFireGuidance')
            if(autoFireGuidance){
                this.p.ellipse(
                    this.x,
                    this.y,
                    autoFireGuidance.value
                )
            }
            this.p.noStroke()
        }
    }

}
