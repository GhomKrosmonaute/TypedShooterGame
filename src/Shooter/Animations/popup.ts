import {AnimationMinimalOptions, AnimationOptions} from '../../interfaces';
import { fade } from '../../utils';

export default function popup( options:AnimationMinimalOptions ): AnimationOptions {
    return {
        ...options,
        className: options.className || 'popup',
        draw: a => {
            const shift = a.value.index * a.p.height * .10
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
            a.p.text(a.value.text, 0, a.p.height * -.2 + shift)
        }
    }
}