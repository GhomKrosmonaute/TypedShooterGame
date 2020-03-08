import Enemy from '../Enemy';
import App from '../App';

export default class BlobEnemy extends Enemy {

    speed: number = 2
    baseGain: number = 1
    baseLife: number = 2
    gain: number = 1
    life: number = 2

    constructor( app:App ) {
        super( app )
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
    }

    pattern(): void {
        if(this.life === undefined)
            throw Error(`Blob life is undefined`)
        this.follow(
            this.app.player,
            this.speed
        )
        this.app.enemies.forEach( enemy => {
            if(!enemy.isOutOfLimits())
                if(this.life >= enemy.life && this !== enemy)
                    if(this.app.areOnContact( this, enemy )){
                        this.absorb(enemy)
                        enemy.placeOutOfLimits()
                    }
        })
    }

    absorb( enemy:Enemy ){
        this.life += enemy.life
        this.gain += enemy.gain
    }

}
