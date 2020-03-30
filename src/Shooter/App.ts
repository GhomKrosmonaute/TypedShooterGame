import p5 from 'p5'
// @ts-ignore
import fontUrl from './fonts/Baloo2-Regular.ttf'
import {KeyMode, Keys, Palette, SceneName, Vector2D} from '../interfaces'
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
import Cursor from './Entities/Cursor';
import Particles from './Entities/Particles';
import Color from './Entities/Color';

export default class App {

    private readonly cursor:Cursor

    public _sceneName:SceneName
    public readonly scenes = {
        party: new Party(this),
        manual: new Manual(this),
        profile: new Profile(this),
        scores: new Scores(this)
    }

    public readonly version = VERSION
    public readonly debug = false

    private hardcoreVariator:Variation

    public gamepad?:Gamepad
    public keys:Keys = {}
    public rate:Rate
    public useGamepad = false
    public particles:Particles
    public lightModeTransition:number
    public keyModes:KeyMode[] = keyModes

    constructor(
        public p:p5,
        public colors:Palette,
        public api:API
    ){

        const storage = localStorage.getItem('shooter')
        if( !storage || JSON.parse(storage).version !== this.version )
            localStorage.setItem('shooter', JSON.stringify({
                keyModeIndex: 0,
                lightMode: true,
                version: this.version
            }))

        this.particles = new Particles(this,50,0,5)
        this.hardcoreVariator = new Variation(-10,10,2)
        this.lightModeTransition = this.lightMode ? 0 : 255
        this.cursor = new Cursor(this)
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
            this.cursor.step()
            if(this.lightMode){
                if(this.lightModeTransition > 0)
                    this.lightModeTransition -= 25.5
            }else{
                if(this.lightModeTransition < 255)
                    this.lightModeTransition += 25.5
            }
        }
        if(this.scene.rate.canTrigger(true)){
            for(const className in this.scene.animations)
                if(this.scene.animations[className]){
                    this.scene.animations[className] = this.scene.animations[className].filter( a => !a.finish )
                    this.scene.animations[className].forEach( a => a.step() )
                }
            this.scene.time += this.scene.rate.interval
            this.scene.step()
            if(this.scene.showParticles){
                this.particles.step()
                this.particles.move(
                    this.p.map(this.p.mouseX, 0, this.p.width, -2,2) * -1,
                    this.p.map(this.p.mouseY, 0, this.p.height, -2,2) * -1
                )
            }
        }
        if(this.hardcore)
            this.hardcoreVariator.step()
    }

    public async draw(){
        this.p.background(this.black)
        this.p.translate(
            this.p.width * .5,
            this.p.height * .5
        )
        if(this.scene.showParticles)
            this.particles.draw()
        this.scene.draw()
        this.scene.links.forEach( link => link.draw() )
        if(this.scene.form)
            this.scene.form.draw()
        this.p.fill(this.white,40)
        this.p.noStroke()
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        this.p.textSize(15)
        this.p.text(`Shooter Game v${this.version} © Ghom`,0,this.p.height * .5 - 15)
        if(this.hardcore){
            this.p.fill(255,0,0,this.p.random(100,255))
            this.p.textSize(25)
            this.p.text('HARDCORE MODE',0,this.p.height * .5 - (40 + this.hardcoreVariator.value))
        }
        this.cursor.draw()
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
    public mouseShift( shift:number ): Vector2D {
        return {
            x: this.p.map(this.mouse.x,0,this.p.width,shift * -1, shift),
            y: this.p.map(this.mouse.y,0,this.p.height,shift * -1, shift)
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

    public get keyModeIndex(): number { return this.api.load('keyModeIndex') }
    public set keyModeIndex( index:number ){ this.api.save('keyModeIndex',index) }

    public get lightMode(): boolean { return this.api.load('lightMode') }
    public set lightMode(isActivate:boolean ){ this.api.save('lightMode',isActivate) }

    public get black(): number { return this.lightModeTransition  }
    public get white(): number { return 255 - this.lightModeTransition }

    public get color(): p5.Color {
        return this.red(.5)
    }
    public red( proportion:number = 1, alpha:number = 1 ): p5.Color {
        const red = this.colors.blue.fusion(this.colors.red,proportion)
        const color = this.p.color(...red.rgb)
        color.setAlpha(255 * alpha)
        return color
    }
    public blue( proportion:number = 1, alpha:number = 1 ): p5.Color {
        return this.red(1-proportion,alpha)
    }
    public alpha( proportion:number = 1 ): p5.Color {
        return this.red(.5,proportion)
    }
    public light( proportion:number, alpha:number = 1 ): p5.Color {
        const base = new Color(this.p,this.color)
        const light = base.fusion([255,255,255],proportion)
        const color = this.p.color(...light.rgb)
        color.setAlpha(255 * alpha)
        return color
    }
    public dark( proportion:number, alpha:number = 1 ): p5.Color {
        return this.light(1-proportion,alpha)
    }

    public whiteAt(light:number ): number {
        return this.p.map(light,0,255,this.black,this.white)
    }

    public keyIsPressed( type:'move'|'shoot', direction:'up'|'down'|'left'|'right' ): boolean {
        for(const key in this.keys) if(this.keys[key]) if(this.keyMode[type][direction].includes(key)) return true
        return false
    }

    public keyReleased(key:string): void { this.keys[key] = false }

    public keyPressed(key:string): void { this.keys[key] = true
        if(!this.scene.form || !this.scene.form.focus){
            if(this.keyMode.shortcuts.lightMode.includes(key)) this.switchLightMode()
            else if(this.keyMode.shortcuts.keyMode.includes(key)) this.switchKeyMode()
            else if(this.keyMode.shortcuts.gamepad.includes(key)) this.switchGamepad()
            else for(const sceneName in this.scenes)
                if(this.keyMode.shortcuts[sceneName as SceneName].includes(key))
                    this.sceneName = sceneName as SceneName
        } this.scene.keyPressed(key)
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
    public mouseMoved(): void {
        this.cursor.mouseMoved()
    }
    public mousePressed(){
        if(this.scene.form) this.scene.form.mousePressed()
        this.scene.links.forEach( link => link.mousePressed() )
    }

    public switchGamepad(): void {
        if(!this.gamepad) this.useGamepad = false
        else this.useGamepad = !this.useGamepad
        if(this.useGamepad) this.scene.setPopup(`Using "${this.gamepad.id}" gamepad`)
        else this.scene.setPopup('Using keyboard')
    }
    public setGamepad( gamepad:Gamepad ): void {
        this.scene.setPopup(`Gamepad detected (${gamepad.id})`)
        this.gamepad = gamepad
    }
    public unsetGamepad(): void {
        this.scene.setPopup(`Gamepad disconnected`)
        this.gamepad = null
    }

}
