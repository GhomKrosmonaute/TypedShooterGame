
import {AnimationOptions, Vector2D} from '../../interfaces';
import p5 from 'p5';
import App from '../App';
import Scene from './Scene';

export default class Animation {

    public readonly p:p5
    public readonly startTime:number
    public readonly endTime:number
    public readonly duration:number
    public position:Vector2D
    public value:any
    public class?:string
    public id?:string
    private readonly onDraw:( animation:Animation ) => void

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
        this.position = options.position || {x:0,y:0}
        if(options.id){
            this.id = options.id
            scene.animations = scene.animations.filter( a => {
                return a === this || a.id !== options.id
            })
        }
        if(options.class) this.class = options.class
    }

    public draw(): void {
        this.onDraw(this)
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

}