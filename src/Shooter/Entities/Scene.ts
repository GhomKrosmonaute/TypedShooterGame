import App from '../App';
import p5 from 'p5';
import Rate from './Rate';
import Animation from './Animation';
import {AnimationOptions} from '../../interfaces';
import {fade} from '../../utils';

export default abstract class Scene {

    public abstract rate:Rate
    public abstract time:number
    public abstract animations:Animation[]

    public abstract reset(): any
    public abstract draw(): any
    public abstract step(): any
    public abstract keyPressed( key:string ): any
    public abstract mousePressed(): any

    public p:p5

    protected constructor( public app:App ) {
        this.p = app.p
    }

    protected drawAnimations(): void {
        this.animations.forEach( a => a.draw() )
    }

    public setAnimation( options:AnimationOptions ): void {
        const animation = new Animation( this, options )
        this.animations.push(animation)
    }

    public setPopup( text:string ): void {
        this.setAnimation({
            class: 'popup',
            value: this.animations.filter( a => a.class === 'popup' ).length - 1,
            duration: 3000,
            draw: (a:Animation) => {
                const shift = a.value * a.p.height * .10
                const { x, y } = a.position
                a.p.noStroke()
                a.p.fill(a.scene.app.light, fade(a.p,30, {
                    value: a.time,
                    valueMax: 3000,
                    overflow: 7
                }))
                a.p.rect(
                    x + a.p.width * -.5,
                    y + a.p.height * -.25 + shift,
                    a.p.width,
                    a.p.height * .1
                )
                a.p.fill(a.scene.app.light, fade(a.p,255, {
                    value: a.time,
                    valueMax: 3000,
                    overflow: 4
                }))
                a.p.textAlign(a.p.CENTER,a.p.CENTER)
                a.p.text(text, 0, a.p.height * -.2 + shift)
            }
        })
    }

}