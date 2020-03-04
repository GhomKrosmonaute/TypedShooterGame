import Positionable from './Positionable';
import App from './App';

export default class Enemy extends Positionable {

    protected gain = 1
    protected readonly lifeMax = 2

    public life:number

    constructor(
        public app:App
    ){
        super( app.p, 0, 0, 40 )
        this.setPosition()
    }

    public step(){
        this.app.player.shoots.forEach( shoot => {
            if(this.app.areOnContact(shoot,this)){
                if(shoot.handleShoot(this)) this.life --
            }
        })
        if(this.app.areOnContact(this,this.app.player)){
            this.app.player.life -= this.life
            this.life = 0
        }
        if(this.life <= 0){
            this.setPosition()
            this.app.player.score += this.gain
        }
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

    public get currentRadius(){
        return Math.min(this.p.map(this.life, 0, this.lifeMax, 0, this.radius),150)
    }

    public follow( positionable:Positionable, speed:number ){
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

    public setPosition(){
        const { random, width, height } = this.p
        this.life = this.lifeMax
        while(this.isOnScreen()){
            this.x = random( width * -2, width * 2 )
            this.y = random( height * -2, height * 2 )
        }
    }

}