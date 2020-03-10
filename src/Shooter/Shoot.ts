import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';

export default class Shoot extends Positionable {

    public readonly basePosition:Positionable
    private readonly speed:number
    public readonly damage:number
    private drill:number = 1
    private toIgnore:Enemy[] = []

    constructor(
        public player:Player,
        private readonly directionX:number,
        private readonly directionY:number
    ){
        super( player.p, player.x, player.y, 20 )
        this.basePosition = new Positionable( this.p, player.x, player.y )
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
                    const dist = enemy.dist(this)
                    if(dist < falcon.level * 100 && temp.dist < dist){
                        temp.enemy = enemy
                        temp.dist = dist
                    }
                }
                target = temp.enemy
            }
            if(falcon && target){
                // follow enemy
                this.follow(target,this.speed)
            }else{
                // rectilinear uniform move
                if(this.directionX !== 0){
                    this.x += this.speed * this.directionX
                }
                if(this.directionY !== 0){
                    this.y += this.speed * this.directionY
                }
            }
        }
    }

    public draw(): void {
        this.p.fill(255)
        this.p.ellipse(
            this.x,
            this.y,
            Math.max(
                0,
                Math.min(
                    this.currentRadius,
                    this.p.map(
                        this.dist(this.basePosition),
                        0,
                        this.player.shootRange,
                        this.currentRadius * 5,
                        0
                    ),
                    this.p.map(
                        this.dist(this.basePosition),
                        0,
                        this.player.shootRange,
                        0,
                        this.currentRadius * 5
                    )
                )
            )
        )
    }

    public get currentRadius(): number {
        const bazooka = this.player.getPassive('bazooka')
        if(!bazooka) return this.radius
        return this.radius + bazooka.level * (this.radius * .25)
    }

}
