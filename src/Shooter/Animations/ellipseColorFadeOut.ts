import {AnimationMinimalOptions, AnimationOptions} from '../../interfaces';
import p5 from 'p5';

export default function ellipseColorFadeOut( options:AnimationMinimalOptions ): AnimationOptions {
    return {
        ...options,
        className: options.className || 'high',
        draw: a => {
            const color = a.value as p5.Color
            const entity = a.position as any
            color.setAlpha(a.p.map(a.time,0,a.duration,150,0))
            a.p.noStroke()
            a.p.fill(color)
            a.p.ellipse( a.position.x, a.position.y,entity.currentRadius || entity.radius)
        }
    }
}