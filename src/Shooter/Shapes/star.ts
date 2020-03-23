import p5 from 'p5';

export default function star( p:p5, x:number, y:number, radiusIn:number, radiusOut:number, points:number): void {
    p.angleMode(p.RADIANS)
    let angle = p.TWO_PI / points
    let halfAngle = angle / 2.0
    p.beginShape()
    for (let a = 0; a < p.TWO_PI; a += angle) {
        let sx = x + p.cos(a) * radiusOut
        let sy = y + p.sin(a) * radiusOut
        p.vertex(sx, sy)
        sx = x + p.cos(a + halfAngle) * radiusIn
        sy = y + p.sin(a + halfAngle) * radiusIn
        p.vertex(sx, sy)
    }
    p.endShape(p.CLOSE)
    p.angleMode(p.DEGREES)
}