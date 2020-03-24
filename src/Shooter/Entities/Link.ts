import Zone from './Zone';
import App from '../App';
import {LinkOptions, SceneName, Vector2D} from '../../interfaces';
import p5 from 'p5';
import Scene from './Scene';

export default class Link extends Zone {

    public targetName:SceneName
    public lastScene:Scene
    public resetNew:boolean
    public resetOld:boolean
    public text?:string
    public p:p5

    constructor(
        public scene:Scene,
        x:number,
        y:number,
        options:LinkOptions
    ) {
        super(x,y,200,90,true)
        this.p = scene.app.p
        this.targetName = options.targetName
        this.resetNew = !!options.resetNew
        this.resetOld = !!options.resetOld
        this.text = options.text
        scene.links.push(this)
    }

    draw(): void {
        this.p.fill(255,this.touchVector(this.scene.app.mouseFromCenter) ? 255 : 100)
        this.p.noStroke()
        this.p.textSize(this.height * .5)
        this.p.text(this.text || this.targetName,
            this.center.x, this.center.y
        )
    }

    mousePressed(): void {
        if(this.touchVector(this.scene.app.mouseFromCenter)){
            if(this.resetNew) this.scene.app.scenes[this.targetName].reset()
            this.scene.app.sceneName = this.targetName
            if(this.resetOld) this.scene.reset()
        }
    }

}