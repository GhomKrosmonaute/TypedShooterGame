import App from '../App';
import p5 from 'p5';

export default abstract class Scene {

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
        this.app.animations.forEach( a => a.draw() )
    }

}