import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
import {fade} from '../../utils';
import explosion from '../Animations/explosion';
import {Vector2D} from '../../interfaces';

export default class Shot extends Positionable {

    public readonly basePosition:Positionable
    public readonly direction:Positionable
    private readonly scapegoat:Positionable
    private readonly speed:number
    public readonly damage:number
    private piercingShots:number = 1
    private toIgnore:Enemy[] = []
    private currentTarget:Positionable

    constructor(
        public player:Player,
        directionX:number,
        directionY:number
    ){
        super( player.p, player.x, player.y, player.shotSize )
        this.scapegoat = new Positionable( this.p, this.x, this.y )
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
        this.currentTarget = null
        if(this.rawDist(this.basePosition) > this.player.shotRange){
            this.terminate()
        }else{
            const autoFireGuidance = this.player.getPassive('autoFireGuidance')
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
                this.currentTarget = temp.enemy
            }
            if(this.currentTarget){
                this.scapegoat.follow(this.currentTarget,this.speed * 1.5)
                this.follow(this.scapegoat,this.speed)
            }else{
                this.scapegoat.place(this)
                this.follow(this.direction,this.speed)
            }
        }
    }

    public draw(): void {
        if(this.isOnScreen()){
            if(this.player.party.app.lightMode) this.p.noStroke()
            else {
                this.p.stroke(0)
                this.p.strokeWeight(1)
            }
            this.p.fill(200,200,255)
            this.p.ellipse(
                this.x,
                this.y,
                fade( this.p, this.diameter,
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
                this.p.line( this.x, this.y,
                    this.scapegoat.x,
                    this.scapegoat.y
                )
                this.p.line(
                    this.scapegoat.x,
                    this.scapegoat.y,
                    this.currentTarget.x,
                    this.currentTarget.y
                )
            }
        }
    }
}
