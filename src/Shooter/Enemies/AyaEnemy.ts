import Enemy from '../Enemy';

export default class AyaEnemy extends Enemy {

    speed: number = 4
    gain: number = 1
    lifeMax: number = 2

    public pattern(): void {
        this.follow(this.app.player)
    }

}
