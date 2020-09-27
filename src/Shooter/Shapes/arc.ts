import { Vector2D } from "../../interfaces"
import { isOnArc, rawDist, random, map } from "../../utils"
import App from "../App"

export function arc(
  app: App,
  a: Vector2D,
  b: Vector2D,
  arcWeight: number
): void {
  if (rawDist(a, b) < 5) return
  const points: Vector2D[] = []
  const pointCount = Math.floor((rawDist(a, b) + 1) / 50)
  points.push(a)
  while (points.length < pointCount) {
    const lastPoint = points[points.length - 1]
    let point: Vector2D = null
    while (!isOnArc(a, b, point, arcWeight))
      point = {
        x: random(
          lastPoint.x,
          map(points.length, 1, pointCount, lastPoint.x, b.x)
        ),
        y: random(
          lastPoint.y,
          map(points.length, 1, pointCount, lastPoint.y, b.y)
        ),
      }
    points.push(point)
  }
  points.push(b)
  app.p.noFill()
  app.p.stroke(app.red(Math.random()))
  app.p.strokeWeight(random(3, 6))
  app.p.beginShape()
  for (const point of points) {
    app.p.vertex(point.x, point.y)
  }
  app.p.endShape()
}
