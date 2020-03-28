
import {AnimationOptions, Vector2D} from '../../interfaces'
import p5 from 'p5'
import Scene from './Scene'
import {isOutOfViewPort, map} from '../../utils'

export default class Animation {

    public readonly p:p5
    public readonly startTime:number
    public readonly endTime:number
    public readonly duration:number
    public position:Vector2D
    public value:any
    public className?:string
    public id?:string
    public attach:boolean
    public finish = false
    private readonly onDraw:( animation:Animation ) => void
    private readonly callback?:( animation:Animation ) => void

    constructor(
        public scene:Scene,
        options:AnimationOptions
    ) {
        this.p = scene.p
        this.startTime = scene.time
        this.endTime = this.startTime + options.duration
        this.onDraw = options.draw
        this.duration = options.duration
        this.value = options.value
        this.attach = !!options.attach
        this.position = options.position || {x:0,y:0}
        this.callback = options.callback || ((a)=>{})
        this.className = options.className
        if(options.id){
            this.id = options.id
            scene.animations[this.className] = scene.animations[this.className].filter( a => {
                return a === this || a.id !== options.id
            })
        }
    }

    public draw(): void {
        if(!isOutOfViewPort(this.position))
            this.onDraw(this)
    }

    public step(): void {
        if(this.timeIsOut){
            this.finish = true
            this.callback(this)
        }
    }

    public get time(): number {
        return this.scene.time - this.startTime
    }

    public get timeIsOut(): boolean {
        return this.time > this.duration
    }

    public move( x:number, y:number ): void {
        this.position.x += x
        this.position.y += y
    }

    public map( start:number, stop:number ): number {
        return map(this.time,0,this.duration,start,stop)
    }

}