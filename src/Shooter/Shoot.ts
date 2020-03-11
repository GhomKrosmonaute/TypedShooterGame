import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
import {fade} from "../utils";

export default class Shoot extends Positionable {

    public readonly basePosition:Positionable
    public readonly direction:Positionable
    private readonly speed:number
    public readonly damage:number
    private drill:number = 1
    private toIgnore:Enemy[] = []

    constructor(
        public player:Player,
        directionX:number,
        directionY:number
    ){
        super( player.p, player.x, player.y, 20 )
        this.direction = new Positionable( this.p,
            directionX * 5000,
            directionY * 5000
        )
        this.basePosition = new Positionable( this.p,
            player.x + player.speedX * 10,
            player.y + player.speedY * 10
        )
        this.speed = this.player.shootSpeed
        this.damage = this.player.shootDamage
        const drill = this.player.getPassive('drill')
        if(drill) this.drill += drill.level
    }

    public handleShoot( enemy:Enemy ): boolean {
        if(!this.toIgnore.includes(enemy)){
            this.drill --
            this.toIgnore.push(enemy)
            if(this.drill === 0)
                this.placeOutOfLimits()
            return true
        }
        return false
    }

    public step(): void {
        if(this.dist(this.basePosition) > this.player.shootRange){
            this.placeOutOfLimits()
        }else{
            const falcon = this.player.getPassive('falcon')
            let target:Enemy = null
            if(falcon){
                const temp:{
                    enemy: Enemy
                    dist: number
                } = {
                    enemy: null,
                    dist: Infinity
                }
                for(const enemy of this.player.app.enemies){
                    if(!this.toIgnore.includes(enemy) && !enemy.immune){
                        const dist = enemy.dist(this)
                        if(dist < falcon.level * 100 && temp.dist > dist){
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
        this.p.fill(255)
        this.p.ellipse(
            this.x,
            this.y,
            fade( this.p, this.currentRadius,
                {
                    value: this.dist(this.basePosition),
                    valueMax: this.player.shootRange,
                    overflow: 5
                },
                {
                    value: this.dist(this.player),
                    valueMax: this.player.shootRange,
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
                this.player.shootRange * 2
            )
            const falcon = this.player.getPassive('falcon')
            if(falcon){
                this.p.ellipse(
                    this.x,
                    this.y,
                    falcon.level * 100
                )
            }
            this.p.noStroke()
        }
    }

    public get currentRadius(): number {
        const bazooka = this.player.getPassive('bazooka')
        if(!bazooka) return this.radius
        return this.radius + bazooka.level * (this.radius * .25)
    }

}
