import Animation from "../Entities/Animation"
import { AnimationMinimalOptions, AnimationOptions } from "../../interfaces"
import p5 from "p5"

export default function explosion(
  options: AnimationMinimalOptions
): AnimationOptions {
  return {
    ...options,
    draw: (a) => {
      const opacity = a.p.map(a.time, 0, a.duration, 255, 0)
      a.p.noStroke()
      a.p.fill(255, 0, 0, opacity)
      a.p.ellipse(
        a.position.x,
        a.position.y,
        a.p.map(a.time, 0, a.duration, a.value, 1)
      )
      a.p.noFill()
      a.p.stroke(255, opacity)
      a.p.strokeWeight(a.p.map(a.time, 0, a.duration, 1, 10))
      a.p.ellipse(
        a.position.x,
        a.position.y,
        a.p.map(a.time, 0, a.duration, 1, a.value)
      )
    },
  }
}
