import Enemy from '../Enemy';
import App from '../App';

export default class AyaEnemy extends Enemy {

    speed: number = 4
    gain: number = 1
    life: number = 2
    id = 'aya'

    constructor( app:App ) {
        super( app )
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
    }

    public pattern(): void {
        this.follow(this.app.player, this.speed)
    }

}
