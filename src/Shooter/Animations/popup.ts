import { AnimationOptions, PopupOptions } from "../../interfaces"
import { fade, seconds } from "../../utils"

export default function popup(options: PopupOptions): AnimationOptions {
  return {
    ...options,
    className: "popup",
    duration: seconds(1),
    draw: (a) => {
      const shift = a.value.index * (a.p.height * 0.1)
      a.p.noStroke()
      a.p.fill(
        a.scene.app.white,
        fade(30, {
          value: a.time,
          valueMax: a.duration,
          overflow: 7,
        })
      )
      a.p.rect(
        a.position.x + a.p.width * -0.5,
        a.position.y + a.p.height * -0.25 + shift,
        a.p.width,
        a.p.height * 0.1
      )
      a.p.fill(
        a.scene.app.white,
        fade(255, {
          value: a.time,
          valueMax: a.duration,
          overflow: 4,
        })
      )
      a.p.textSize(30)
      a.p.textAlign(a.p.CENTER, a.p.CENTER)
      a.p.text(a.value.text, 0, a.p.height * -0.2 + shift)
    },
  }
}
