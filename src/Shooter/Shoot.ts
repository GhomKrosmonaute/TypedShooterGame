import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
import Drill from './Bonus/Drill';

export default class Shoot extends Positionable {

    private readonly speed:number
    private drill:number = 1
    private toIgnore:Enemy[] = new Array()

    constructor(
        public player:Player,
        private readonly directionX:number,
        private readonly directionY:number
    ){
        super( player.p, player.x, player.y, 20 )
        this.speed = this.player.shootspeed
        const drillPassive = this.player.passives.find( p => p instanceof Drill )
        if(drillPassive) this.drill += drillPassive.level
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
        if(this.directionX !== 0){
            this.x += this.speed * this.directionX
        }
        if(this.directionY !== 0){
            this.y += this.speed * this.directionY
        }
        if(this.playerDistance > this.player.shootrange){
            this.placeOutOfLimits()
        }
    }

    public draw(): void {
        this.p.fill(255)
        this.p.ellipse(
            this.x,
            this.y,
            Math.min(
                this.radius,
                this.p.map(
                    this.playerDistance,
                    0,
                    this.player.shootrange,
                    0,
                    this.radius * 5
                )
            )
        )
    }

    public get playerDistance(): number {
        return this.p.dist(
            this.x, this.y,
            this.player.x, this.player.y
        )
    }

}