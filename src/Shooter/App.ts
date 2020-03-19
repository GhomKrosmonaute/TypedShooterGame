import p5 from 'p5'
// @ts-ignore
import cursorImage from './images/cursor.png'
import {GameAnimation, KeyMode, Keys, PuttedAnimation, SceneName, Scenes} from '../interfaces'
import Rate from './Entities/Rate'
import {fade} from '../utils'
import {keyModes} from '../config';
import Party from './Entities/Scenes/Party';
import Pause from './Entities/Scenes/Pause';
import Scene from './Entities/Scene';
import API from './API';

export default class App {

    private readonly cursorImage:p5.Image
    private readonly baseCursorFadeOut = 1000

    public sceneName:SceneName
    private readonly scenes:Scenes = {
        party: new Party(this),
        pause: new Pause(this)
    }

    public readonly version = '0.1.4'
    public readonly debug = false

    private fullscreen:boolean
    private cursorFadeOut:number

    public keys:Keys = {}
    public rate:Rate
    public darkModeTransition:number
    public keyModes:KeyMode[] = keyModes
    public animations:PuttedAnimation[]

    constructor( public p:p5, public api:API ){

        const storage = localStorage.getItem('shooter')
        if( !storage || JSON.parse(storage).version !== this.version )
            localStorage.setItem('shooter', JSON.stringify({
                keyModeIndex: 0,
                darkMode: true,
                version: this.version
            }))

        this.darkModeTransition = this.darkMode ? 0 : 255
        this.cursorImage = p.loadImage(cursorImage)
        this.p.smooth()
        this.p.angleMode(this.p.DEGREES)
        this.reset()
    }

    public reset(): void {
        this.sceneName = 'pause'
        this.rate = new Rate(25)
        this.animations = []
    }

    public async step(){
        if(this.rate.canTrigger(true)){
            this.animations = this.animations.filter( anim => Date.now() < anim.endTime )
            if(this.darkMode){
                if(this.darkModeTransition > 0)
                    this.darkModeTransition -= 25.5
            }else{
                if(this.darkModeTransition < 255)
                    this.darkModeTransition += 25.5
            }
            this.scene.step()
        }
    }

    public async draw(){
        this.p.background(this.dark)
        this.p.translate(
            this.p.width * .5,
            this.p.height * .5
        )
        this.scene.draw()
        this.p.translate(
            this.p.width * -.5,
            this.p.height * -.5
        )
        if(Date.now() < this.cursorFadeOut){
            this.p.noStroke()
            this.p.tint(
                255,
                this.p.map(
                    this.cursorFadeOut - Date.now(),
                    0,
                    this.baseCursorFadeOut,
                    0,
                    255
                )
            )
            this.p.image(this.cursorImage,this.p.mouseX,this.p.mouseY)
        }
    }

    public get scene(): Scene {
        return this.scenes[this.sceneName]
    }

    public setAnimation( animation:GameAnimation, id?:string ): void {
        const puttedAnimation:PuttedAnimation = { id,
            animation: animation,
            startTime: Date.now(),
            endTime: Date.now() + animation.duration
        }
        this.animations.push(puttedAnimation)
    }
    public setPopup( text:string ): void {
        this.setAnimation({
            value: {
                app: this,
                index: this.animations.filter( (anim:PuttedAnimation) => anim.id === 'popup' ).length - 1
            },
            duration: 3000,
            draw(p, time, values ): void {
                const shift:number = values.index * p.height * .10
                p.noStroke()
                p.fill(values.app.light, fade(p,30, {
                    value: time,
                    valueMax: 3000,
                    overflow: 7
                }))
                p.rect(
                    p.width * -.5,
                    p.height * -.25 + shift,
                    p.width,
                    p.height * .1
                )
                p.fill(values.app.light, fade(p,255, {
                    value: time,
                    valueMax: 3000,
                    overflow: 4
                }))
                p.textAlign(p.CENTER,p.CENTER)
                p.text(text, 0, p.height * -.2 + shift)
            }
        }, 'popup')
    }

    public switchDarkMode(): void {
        this.darkMode = !this.darkMode
    }

    public switchKeyMode(): void {
        this.keyModeIndex ++
        if(this.keyModeIndex >= this.keyModes.length)
            this.keyModeIndex = 0
        this.keys = {}
        this.setPopup('KeyMode changed : ' + this.keyMode.name)
    }

    public get keyMode(): KeyMode {
        return this.keyModes[this.keyModeIndex]
    }

    public keyIsPressed( type:'move'|'shoot', direction:'up'|'down'|'left'|'right' ): boolean {
        for(const key in this.keys)
            if(this.keys[key])
                if(this.keyMode[type][direction].includes(key))
                    return true
        return false
    }

    public get keyModeIndex(): number { return this.api.load('keyModeIndex') }
    public set keyModeIndex( index:number ){ this.api.save('keyModeIndex',index) }
    public get darkMode(): boolean { return this.api.load('darkMode') }
    public set darkMode( isActivate:boolean ){ this.api.save('darkMode',isActivate) }
    public get dark(): number { return this.darkModeTransition  }
    public get light(): number { return 255 - this.darkModeTransition }

    public mouseMoved(): void {
        this.cursorFadeOut = Date.now() + this.baseCursorFadeOut
    }

    public keyReleased(key:string): void { this.keys[key] = false }
    public keyPressed(key:string): void { this.keys[key] = true
        if(key === 'm') this.switchDarkMode()
        else if(key === 'k') this.switchKeyMode()
        this.scene.keyPressed(key)
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
