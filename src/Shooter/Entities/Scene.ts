import App from '../App';
import p5 from 'p5';
import Rate from './Rate';
import Animation from './Animation';
import {AnimationOptions} from '../../interfaces';
import {fade} from '../../utils';
import popup from '../Animations/popup';
import Link from './Link';
import Form from './Form';

export default abstract class Scene {

    public rate:Rate = new Rate(25)
    public time:number = 0
    public animations:Animation[] = []
    public links:Link[] = []
    public form?:Form

    public abstract reset(): any
    public abstract draw(): any
    public abstract step(): any
    public abstract keyPressed( key:string ): any

    public p:p5

    protected constructor( public app:App ) {
        this.p = app.p
    }

    protected drawAnimations( className?:string ): void {
        if(className === 'all') this.animations.forEach( a => a.draw() )
        else if(!className)
            this.animations
                .filter( a => !a.className )
                .forEach( a => a.draw() )
        else this.animations
            .filter( a => a.className === className )
            .forEach( a => a.draw() )
    }

    public setAnimation( options:AnimationOptions ): void {
        const animation = new Animation( this, options )
        this.animations.push(animation)
    }

    public setPopup( text:string ): void {
        this.setAnimation(popup({
            attach: true,
            value: { text,
                index: this.animations.filter( a => a.className === 'popup' ).length - 1
            },
            duration: 3000
        }))
    }

}