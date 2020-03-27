import p5 from 'p5';
import {Vector2D} from '../../interfaces';
import {isOnArc, rawDist, random, map} from '../../utils';

export function arc( p:p5, a:Vector2D, b:Vector2D, arcWeight:number ): void {
    if(rawDist(a,b) < 5) return
    const points:Vector2D[] = []
    const pointCount = Math.floor((rawDist(a,b) + 1) / 50)
    points.push(a)
    while(points.length < pointCount){
        const lastPoint = points[points.length-1]
        let point:Vector2D = null
        while(!isOnArc(a,b,point,arcWeight))
            point = {
                x: random(lastPoint.x,map(points.length,1,pointCount,lastPoint.x,b.x)),
                y: random(lastPoint.y,map(points.length,1,pointCount,lastPoint.y,b.y))
            }
        points.push(point)
    }
    points.push(b)
    p.noFill()
    p.stroke(random(100,255),100,random(100,255))
    p.strokeWeight(random(3,6))
    p.beginShape()
    for(const point of points){
        p.vertex(point.x,point.y)
    }
    p.endShape()
}