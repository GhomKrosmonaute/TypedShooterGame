import App from '../App';
import p5 from 'p5';

export default abstract class Scene {

    public abstract reset(): any
    public abstract draw(): any
    public abstract step(): any
    public abstract keyPressed( key:string ): any

    public p:p5

    protected constructor( public app:App ) {
        this.p = app.p
    }

    protected drawAnimations(): void {
        this.app.animations.forEach( anim => {
            anim.animation.draw( this.p,
                Math.max(0,
                    Math.min( anim.animation.duration,
                        this.p.map( Date.now(),
                            anim.startTime,
                            anim.endTime,
                            0,
                            anim.animation.duration
                        )
                    )
                ),
                anim.animation.value
            )
        })
    }

}