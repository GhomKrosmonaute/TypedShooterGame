import Scene from '../Scene';
import Particles from '../Particles';
import {Vector2D} from '../../../interfaces';
import App from '../../App';
import Link from '../Link';
import Rate from '../Rate';
import {seconds} from '../../../utils';
import Zone from '../Zone';

export default class Manual extends Scene {

    private ignoreKeysRate = new Rate(seconds(3))

    constructor( app:App ) {
        super(app)
        const appZone = this.app.zone
        this.links.push(
            new Link( this,
                appZone.fractionX(1/6),
                appZone.fractionY(5/6), {
                    targetName: 'party'
                }
            ),
            new Link( this,
                appZone.fractionX(.5),
                appZone.fractionY(5/6), {
                    targetName: 'scores',
                    resetNew: true
                }
            ),
            new Link( this,
                appZone.fractionX(5/6),
                appZone.fractionY(5/6), {
                    targetName: 'profile',
                    resetNew: true
                }
            )
        )
        this.reset()
    }

    reset(){
        this.ignoreKeysRate.trigger()
    }

    draw() {
        this.p.textAlign(this.p.CENTER,this.p.CENTER)
        if(this.app.useGamepad){
            this.p.noStroke()
            this.p.fill(255,0,255)
            this.p.textSize(20)
            this.p.text(
                JSON.stringify(this.app.gamepad,null,2),
                0,0
            )
        }else{
            const appZone = this.app.zone
            const keyZone = new Zone(
                appZone.fractionX(.1),
                appZone.fractionY(.1),
                appZone.fractionX(.8),
                appZone.fractionY(.8)
            )
            const size = keyZone.fractionHeight(1/Object.keys(this.app.keyMode.shortcuts).length)
            this.drawShortcuts(keyZone,size)
            this.drawDirectionKeys(keyZone,'move', .5, .80,size)
            this.drawDirectionKeys(keyZone,'shoot', .85, .80,size)
            this.drawAnimations('all')
        }
    }

    step() {
        if( this.ignoreKeysRate.canTrigger() && (
            this.app.moveKeyIsPressed() ||
            this.app.shootKeyIsPressed()
        )){
            this.ignoreKeysRate.trigger()
            this.app.sceneName = 'party'
        }
    }

    keyPressed(key: string) {

    }

    private drawShortcuts( zone:Zone, size:number ): void {
        const shift5 = this.app.mouseShift(5)
        let index = 0
        const shortcutsZone = new Zone(
            shift5.x + zone.start.x,
            shift5.y + zone.start.y,
            shift5.x + zone.fractionX(.3),
            shift5.y + zone.stop.y
        )
        for(const name in this.app.keyMode.shortcuts){
            //@ts-ignore
            const shortcuts = this.app.keyMode.shortcuts[name]
            const shortcutZone = new Zone(
                shift5.x + shortcutsZone.start.x,
                shift5.y + shortcutsZone.start.y + size * index,
                shift5.x + shortcutsZone.stop.x,
                shift5.y + shortcutsZone.start.y + size * (index + 1)
            )
            this.drawKeyWithNameIn(shortcutZone,shortcuts,name,size)
            index ++
        }
    }

    private drawDirectionKeys(
        zone:Zone,
        type:'move'|'shoot',
        proportionX:number,
        proportionY:number,
        size:number
    ): void {
        const shift5 = this.app.mouseShift(5)
        const directionKeysZone = new Zone(
            shift5.x + zone.fractionX(proportionX),
            shift5.y + zone.fractionY(proportionY),
            zone.fractionHeight((1/6) * 3),
            zone.fractionHeight((1/6) * 2),
            true
        )
        this.p.fill(255,0,200)
        this.p.noStroke()
        this.p.textSize(30)
        this.p.text( type.toUpperCase(),
            directionKeysZone.center.x,
            directionKeysZone.start.y - 50
        )
        for(const direction in this.app.keyMode[type]){
            const keyPosition:Vector2D = {x:0, y:0}
            //@ts-ignore
            let key = this.app.keyMode[type][direction][0].replace('Arrow','')
            //@ts-ignore
            switch(direction) {
                case 'down':
                    keyPosition.x = 1
                    keyPosition.y = 1
                    break
                case 'right':
                    keyPosition.x = 2
                    keyPosition.y = 1
                    break
                case 'up':
                    keyPosition.x = 1
                    break
                case 'left':
                    keyPosition.y = 1
            }
            this.drawKey( key,
                shift5.x + directionKeysZone.start.x + keyPosition.x * directionKeysZone.fractionWidth(1/3),
                shift5.y + directionKeysZone.start.y + keyPosition.y * directionKeysZone.fractionWidth(1/3),
                size
            )
        }
    }

    private drawKeyWithNameIn( zone:Zone, keys:string[], name:string, size:number ): void {
        const shift5 = this.app.mouseShift(5)
        this.drawKey( keys[0] === ' ' ? 'Space' : keys[0],
            shift5.x + zone.start.x,
            shift5.y + zone.start.y,
            size
        )
        this.p.textSize(20)
        this.p.text(
            name,
            zone.fractionX(.60),
            zone.center.y
        )
    }

    private drawKey(
        key:string,
        x:number,
        y:number,
        size:number
    ): void {
        const shift5 = this.app.mouseShift(5)
        this.p.noFill()
        this.p.strokeWeight(1)
        this.p.stroke(255,0,200)
        this.p.rect(
            x + 5,
            y + 5,
            size - 10,
            size - 10
        )
        this.p.noStroke()
        this.p.fill(255,0,200)
        this.p.textSize(key.length === 1 ? 30 : 20)
        this.p.text( key.length === 1 ? key.toUpperCase() : key,
            shift5.x + x + size * .5,
            shift5.y + y + size * .5
        )
    }

}