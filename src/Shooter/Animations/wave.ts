
import {AnimationMinimalOptions, AnimationOptions} from '../../interfaces';

export default function wave( options:AnimationMinimalOptions ): AnimationOptions {
    return {
        ...options,
        draw: a => {
            a.p.stroke(a.scene.app.white,a.map(190,0))
            a.p.fill(a.scene.app.white,a.map(90,0))
            a.p.ellipse(a.position.x,a.position.y,a.map(0,a.value))
        }
    }
}