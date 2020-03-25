import p5 from 'p5'
// @ts-ignore
import cursorImage from './images/cursor.png'
// @ts-ignore
import fontUrl from './fonts/Baloo2-Regular.ttf'
import {KeyMode, Keys, SceneName, Vector2D} from '../interfaces'
import Rate from './Entities/Rate'
import {keyModes, VERSION} from '../config';
import Party from './Entities/Scenes/Party';
import Manual from './Entities/Scenes/Manual';
import Scene from './Entities/Scene';
import API from './API';
import Profile from './Entities/Scenes/Profile';
import Scores from './Entities/Scenes/Scores';
import Zone from './Entities/Zone';
import Variation from './Entities/Variation';

export default class App {

    private readonly cursorImage:p5.Image
    private readonly baseCursorFadeOut = 1000

    public _sceneName:SceneName
    public readonly scenes = {
        party: new Party(this),
        manual: new Manual(this),
        profile: new Profile(this),
        scores: new Scores(this)
    }

    public readonly version = VERSION
    public readonly debug = false

    private cursorFadeOut:number
    private hardcoreVariator:Variation

    public keys:Keys = {}
    public rate:Rate
    public lightModeTransition:number
    public keyModes:KeyMode[] = keyModes

    constructor( public p:p5, public api:API ){

        const storage = localStorage.getItem('shooter')
        if( !storage || JSON.parse(storage).version !== this.version )
            localStorage.setItem('shooter', JSON.stringify({
                keyModeIndex: 0,
                lightMode: true,
                version: this.version
            }))

        this.hardcoreVariator = new Variation(-10,10,1)
        this.lightModeTransition = this.lightMode ? 0 : 255
        this.cursorImage = p.loadImage(cursorImage)
        const font = p.loadFont(fontUrl)
        this.p.smooth()
        this.p.angleMode(this.p.DEGREES)
        this.p.textFont(font)
        this.reset()
    }

    public reset(): void {
        this.sceneName = 'manual'
        this.rate = new Rate(25)
    }

    public async step(){
        if(this.rate.canTrigger(true)){
            if(this.lightMode){
                if(this.lightModeTransition > 0)
                    this.lightModeTransition -= 25.5
            }else{
                if(this.lightModeTransition < 255)
                    this.lightModeTransition += 25.5
            }
        }
        if(this.scene.rate.canTrigger(true)){
            this.scene.animations = this.scene.animations.filter( a => !a.finish )
            this.scene.animations.forEach( a => a.step() )
            this.scene.time += this.scene.rate.interval
            this.scene.step()
        }
        if(this.hardcore)
            this.hardcoreVariator.step()
    }

    public async draw(){
        this.p.background(this.dark)
        this.p.translate(
            this.p.width * .5,
            this.p.height * .5
        )
        this.scene.draw()
        this.scene.links.forEach( link => link.draw() )
        if(this.scene.form) this.scene.form.draw()
        this.p.fill(this.light,40)
        this.p.noStroke()
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.textSize(15)
        this.p.text(`Shooter Game v${this.version} © Ghom`,0,this.p.height * .5 - 15)
        if(this.hardcore){
            this.p.fill(255,0,0,50)
            this.p.textSize(20)
            this.p.text('HARDCORE MODE',0,this.p.height * .5 - (35 + this.hardcoreVariator.value))
        }
        this.p.translate(
            this.p.width * -.5,
            this.p.height * -.5
        )
        if(this.scene.time < this.cursorFadeOut){
            this.p.tint(
                255,
                this.p.map(
                    this.cursorFadeOut - this.scene.time,
                    0,
                    this.baseCursorFadeOut,
                    0,
                    255
                )
            )
            this.p.image(this.cursorImage,this.mouse.x,this.mouse.y)
        }
    }

    public get hardcore(): boolean {
        if(!this.scenes) return false
        return this.scenes.party.player.score > 1000
    }

    public get scene(): Scene {
        return this.scenes[this.sceneName]
    }
    public get sceneName(): SceneName {
        return this._sceneName
    }
    public set sceneName( name:SceneName ){
        this._sceneName = name
    }

    public get mouse(): Vector2D {
        return {
            x: this.p.mouseX,
            y: this.p.mouseY
        }
    }
    public get mouseFromCenter(): Vector2D {
        return {
            x: this.p.mouseX - this.p.width * .5,
            y: this.p.mouseY - this.p.height * .5
        }
    }

    public get zone(): Zone {
        return new Zone(0,0,
            this.p.width,
            this.p.height,
            true
        )
    }

    public switchLightMode(): void {
        this.lightMode = !this.lightMode
    }

    public switchKeyMode(): void {
        this.keyModeIndex ++
        if(this.keyModeIndex >= this.keyModes.length)
            this.keyModeIndex = 0
        this.keys = {}
        this.scene.setPopup('KeyMode changed : ' + this.keyMode.name)
    }

    public get keyMode(): KeyMode {
        return this.keyModes[this.keyModeIndex]
    }

    public keyIsPressed( type:'move'|'shoot', direction:'up'|'down'|'left'|'right' ): boolean {
        for(const key in this.keys) if(this.keys[key]) if(this.keyMode[type][direction].includes(key)) return true
        return false
    }

    public get keyModeIndex(): number { return this.api.load('keyModeIndex') }
    public set keyModeIndex( index:number ){ this.api.save('keyModeIndex',index) }
    public get lightMode(): boolean { return this.api.load('lightMode') }
    public set lightMode(isActivate:boolean ){ this.api.save('lightMode',isActivate) }
    public get dark(): number { return this.lightModeTransition  }
    public get light(): number { return 255 - this.lightModeTransition }

    public lightAt( light:number ): number {
        return this.p.map(light,0,255,this.dark,this.light)
    }

    public mouseMoved(): void {
        this.cursorFadeOut = this.scene.time + this.baseCursorFadeOut
    }

    public keyReleased(key:string): void { this.keys[key] = false }
    public keyPressed(key:string): void { this.keys[key] = true
        if(!this.scene.form || !this.scene.form.focus){
            if(this.keyMode.shortcuts.lightMode.includes(key)) this.switchLightMode()
            else if(this.keyMode.shortcuts.keyMode.includes(key)) this.switchKeyMode()
            else for(const sceneName in this.scenes)
                if(this.keyMode.shortcuts[sceneName as SceneName].includes(key))
                    this.sceneName = sceneName as SceneName
        } this.scene.keyPressed(key)
    }

    mousePressed(){
        if(this.scene.form) this.scene.form.mousePressed()
        this.scene.links.forEach( link => link.mousePressed() )
    }

    public moveKeyIsPressed(): boolean { return this.directionalKeyIsPressed('move') }
    public shootKeyIsPressed(): boolean { return this.directionalKeyIsPressed('shoot') }
    private directionalKeyIsPressed( type:'shoot'|'move' ): boolean {
        for(const key in this.keys)
            if(this.keys[key])
                if(
                    this.keyMode[type].up.includes(key) ||
                    this.keyMode[type].down.includes(key) ||
                    this.keyMode[type].left.includes(key) ||
                    this.keyMode[type].right.includes(key)
                ) return true
        return false
    }

    public areOnContact( positionable1:any, positionable2:any ): boolean {
        return (
            this.p.dist(
                positionable1.x, positionable1.y,
                positionable2.x, positionable2.y
            ) < (
                (positionable1.currentRadius || positionable1.radius) +
                (positionable2.currentRadius || positionable2.radius)
            ) / 2
        )
    }

}
