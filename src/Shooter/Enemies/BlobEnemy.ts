import Enemy from '../Enemy';

export default class BlobEnemy extends Enemy {

    speed: number = 2
    gain: number = 1;
    lifeMax: number = 2;

    pattern(): void {
        if(!this.isOutOfLimits()){
            super.step()
            this.follow(
                this.app.player,
                this.speed
            )
            this.app.enemies.forEach( enemy => {
                if(!enemy.isOutOfLimits())
                    if(this.life >= enemy.life)
                        if(this.app.areOnContact( this, enemy ) && this !== enemy ){
                            this.life += enemy.life
                            this.gain += enemy.gain
                            enemy.placeOutOfLimits()
                        }
            })
        }
    }

}
