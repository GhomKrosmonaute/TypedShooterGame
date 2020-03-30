import App from '../App';
import p5 from 'p5';
import Rate from './Rate';
import Animation from './Animation';
import {AnimationClass, AnimationOptions} from '../../interfaces';
import popup from '../Animations/popup';
import Link from './Link';
import Form from './Form';
import Positionable from './Positionable';
import { isOutOfViewPort } from '../../utils';
import Button from './Button';

export default abstract class Scene {

    public rate:Rate = new Rate(25)
    public time:number = 0
    public animations:{[key:string]:Animation[]} = {}
    public links:Link[] = []
    public buttons:Button[] = []
    public form?:Form
    public showParticles = true

    public abstract reset(): any
    public abstract draw(): any
    public abstract step(): any
    public abstract keyPressed( key:string ): any

    public p:p5

    protected constructor( public app:App ) {
        this.p = app.p
    }

    protected drawButtons(): void {
        for(const button of this.buttons)
            button.draw()
    }

    protected drawAnimations( className?:AnimationClass ): void {
        if(!className){
            for(const key in this.animations)
                this.animations[key]
                    .forEach( a => a.draw() )
        }else if(this.animations[className])
            this.animations[className]
                .forEach( a => a.draw() )
    }

    public setAnimation( options:AnimationOptions ): void {
        if(!options.position || !isOutOfViewPort(options.position)){
            const animation = new Animation( this, options )
            if(!this.animations[animation.className])
                this.animations[animation.className] = []
            this.animations[animation.className].push(animation)
        }
    }

    public setPopup( text:string ): void {
        if(!this.animations.popup)
            this.animations.popup = []
        let index = -1
        for(const popupAnimation of this.animations.popup)
            if(popupAnimation.timeIsOut){
                index = this.animations.popup.indexOf(popupAnimation)
                break
            }
        const animation = new Animation( this, popup({
            attach: true,
            value: { text,
                index: index === -1 ? this.animations.popup.length : index
            }
        }))
        this.animations.popup[animation.value.index] = animation
    }

}