import p5 from 'p5';

export function star( p:p5, x:number, y:number, radiusIn:number, radiusOut:number, points:number): void {
    const { TWO_PI, beginShape, vertex, cos, sin, endShape, CLOSE } = p
    let angle = TWO_PI / points;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radiusOut;
        let sy = y + sin(a) * radiusOut;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radiusIn;
        sy = y + sin(a + halfAngle) * radiusIn;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

export function seconds( nbr:number ): number {
    return nbr * 1000
}

export function minutes( nbr:number ): number {
    return nbr * seconds(60)
}