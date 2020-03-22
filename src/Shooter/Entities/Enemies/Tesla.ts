
import Enemy from '../Enemy';
import Party from '../Scenes/Party'
import Shot from "../Shot";
import {Vector2D} from "../../../interfaces";

export default class Tesla extends Enemy {

    public immune: boolean = false
    public speed: number = 3
    public damage: number = 2
    public gain: number = 1
    public life: number = 2
    public arcInterval: number = 500
    public id = 'tesla'
    public arcSize:number
    public arcWeight:number
    public arcTime:number
    public cardinalIndex:number
    public connections:Tesla[] = []

    constructor( party:Party ) {
        super( party )
        const factor = this.p.random(30,50)
        this.radius = factor
        this.arcTime = party.time
        this.arcSize = factor * 10
        this.arcWeight = 15
        this.cardinalIndex = Math.floor(Math.random() * 8)
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamage = this.damage
    }

    public pattern(): void {

        this.connections = this.connections.filter( tesla => {
            return this.dist(tesla) > this.arcSize && !this.app.areOnContact(this,tesla)
        })

        for(const enemy of this.party.enemies){
            if(
                enemy.id === 'tesla' &&
                this.dist(enemy) < this.arcSize &&
                !(enemy as Tesla).connections.includes(this) &&
                !this.connections.includes(enemy as Tesla)
            ) this.connections.push(enemy as Tesla)
        }

        if(this.party.time > this.arcTime)
            for(const tesla of this.connections)
                if(this.isOnArc(tesla,this.party.player)){
                    this.arcTime = this.party.time + this.arcInterval
                    this.party.player.life --
                }

        let target:Vector2D = [
            { x: this.arcSize * -.4, y: 0 },
            { x: this.arcSize * .4, y: 0 },
            { x: 0, y: this.arcSize * -.4 },
            { x: 0, y: this.arcSize * .4 },
            { x: this.arcSize * -.4, y: this.arcSize * -.4 },
            { x: this.arcSize * -.4, y: this.arcSize * .4 },
            { x: this.arcSize * .4, y: this.arcSize * -.4 },
            { x: this.arcSize * .4, y: this.arcSize * .4 }
        ][this.cardinalIndex]

        this.follow(target, this.speed)

    }

    onPlayerContact(): void {
        this.party.player.life -= this.damage
        this.kill()
    }

    kill( addToScore:boolean = false ){
        this.connections = []
        this.party.enemies.forEach( enemy => {
            if(enemy.id === 'tesla')
                (enemy as Tesla).connections = (enemy as Tesla).connections.filter(tesla => tesla !== this )
        })
        super.kill(addToScore)
    }

    onShoot(shoot: Shot): boolean {
        return true
    }

    onDraw(): void {

        for(const tesla of this.connections){
            this.arc(tesla)
            // if(this.isOnArc(tesla,this.app.player))
            //     this.arc(this.app.player)
        }

        this.p.noStroke()
        this.p.fill(200,100,255)
        this.showIfNotOnScreen()
        this.p.ellipse(
            this.x,
            this.y,
            this.currentRadius
        )
    }

    arc( tesla:Tesla ): void {
        if(this.app.areOnContact(this,tesla)) return
        const points:Vector2D[] = []
        const pointCount = Math.ceil((this.dist(tesla) + 1) / 50)
        points.push(this)
        while(points.length < pointCount){
            const lastPoint = points[points.length-1]
            let point:Vector2D|false = false
            while(!this.isOnArc(tesla,point))
                point = {
                    x: this.p.random(lastPoint.x,tesla.x),
                    y: this.p.random(lastPoint.y,tesla.y)
                }
            points.push(point as Vector2D)
        }
        points.push(tesla)
        this.p.noFill()
        this.p.stroke(this.p.random(100,255),100,this.p.random(100,255))
        this.p.strokeWeight(this.p.random(3,6))
        this.p.beginShape()
        for(const point of points){
            this.p.vertex(point.x,point.y)
        }
        this.p.endShape()
    }

    isOnArc(tesla:Tesla, target:Vector2D|false ): boolean { if(!target) return false
        return this.dist(target) + tesla.dist(target) < this.dist(tesla) + (this.arcWeight + tesla.arcWeight) * .5
    }

    public get currentRadius(){
        return this.lifeBasedRadius
    }

}
