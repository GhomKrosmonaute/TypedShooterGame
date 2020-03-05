import Positionable from './Positionable';
import App from './App';
import Shoot from './Shoot';

export default abstract class Enemy extends Positionable {

    public abstract gain:number
    public abstract lifeMax:number
    public abstract speed:number
    public abstract pattern():void

    public life:number

    constructor(
        public app:App
    ){
        super( app.p, 0, 0, 40 )
        this.reset()
    }

    public step(){
        this.app.player.shoots.forEach( shoot => {
            if(this.app.areOnContact(shoot,this))
                if(shoot.handleShoot(this))
                    this.shoot(shoot)
        })
        if(this.app.areOnContact(this,this.app.player)){
            this.app.player.life -= this.life
            this.kill()
        }
        this.pattern()
    }

    public draw(){
        const { fill, map, ellipse, width, height } = this.p
        fill(
            Math.min(map(this.gain, 1, 10, 100, 255),255),
            80,
            Math.max(map(this.gain, 1, 10, 255, 100),100)
        )
        if(!this.isOnScreen()){
            ellipse(
                this.x > width * .5 ? width * .5 : this.x < width * -.5 ? width * -.5 : this.x,
                this.y > height * .5 ? height * .5 : this.y < height * -.5 ? height * -.5 : this.y,
                (this.currentRadius + 1) / 3
            )
        }
        ellipse(
            this.x,
            this.y,
            this.currentRadius
        )

    }

    public kill( addToScore:boolean = false ): void {
        if(addToScore) this.app.player.score += this.gain
        this.reset()
    }

    public shoot( shoot:Shoot ): void {
        this.life -= shoot.damage
        if(this.life <= 0) {
            this.kill(true)
        }
    }

    public get currentRadius(){
        return Math.min(this.p.map(this.life, 0, this.lifeMax, 0, this.radius),150)
    }

    public follow( positionable:Positionable, speed:number = this.speed ){
        const { degrees, atan2, PI, cos, sin, radians } = this.p
        const angle = degrees(
            atan2(
                positionable.y - this.y,
                positionable.x - this.x
            ) + PI
        )
        const speedX = speed * cos(radians(angle))
        const speedY = speed * sin(radians(angle))
        this.move(
            speedX * -2,
            speedY * -2
        )
    }

    public reset(): void {
        const { random, width, height } = this.p
        this.gain = 1
        this.life = this.lifeMax
        while(this.isOnScreen()){
            this.x = random( width * -1.5, width * 1.5 )
            this.y = random( height * -1.5, height * 1.5 )
        }
    }

}
