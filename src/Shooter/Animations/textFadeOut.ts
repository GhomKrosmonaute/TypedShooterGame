import { AnimationMinimalOptions, AnimationOptions } from "../../interfaces"

export default function popup(
  options: AnimationMinimalOptions
): AnimationOptions {
  return {
    ...options,
    draw: (a) => {
      a.p.noStroke()
      a.value.color.setAlpha(a.p.map(a.time, 0, a.duration, 255, 0))
      a.p.fill(a.value.color)
      a.p.textAlign(a.p.CENTER, a.p.CENTER)
      a.p.textSize(a.p.map(a.time, 0, a.duration, 30, 20))
      a.p.text(
        a.value.text,
        a.position.x,
        a.position.y - a.p.map(a.time, 0, a.duration, 0, 100)
      )
    },
  }
}
