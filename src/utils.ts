import p5 from 'p5';
import Drill from './Shooter/Bonus/Drill';
import App from './Shooter/App';
import Bonus from './Shooter/Bonus';
import Enemy from './Shooter/Enemy';
import Carnage from './Shooter/Bonus/Carnage';
import Falcon from './Shooter/Bonus/Falcon';
import Heal from './Shooter/Bonus/Heal';
import Star from './Shooter/Bonus/Star';
import Shield from './Shooter/Bonus/Shield';
import Shotgun from './Shooter/Bonus/Shotgun';
import Bazooka from './Shooter/Bonus/Bazooka';
import Minigun from './Shooter/Bonus/Minigun';
import Sniper from './Shooter/Bonus/Sniper';
import Ping from './Shooter/Bonus/Ping';
import DeadChain from './Shooter/Bonus/DeadChain';
import AyaEnemy from './Shooter/Enemies/AyaEnemy';
import BlobEnemy from './Shooter/Enemies/BlobEnemy';

export function star( p:p5, x:number, y:number, radiusIn:number, radiusOut:number, points:number): void {
    let angle = p.TWO_PI / points;
    let halfAngle = angle / 2.0;
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
        let sx = x + p.cos(a) * radiusOut;
        let sy = y + p.sin(a) * radiusOut;
        p.vertex(sx, sy);
        sx = x + p.cos(a + halfAngle) * radiusIn;
        sy = y + p.sin(a + halfAngle) * radiusIn;
        p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
}

export function seconds( nbr:number ): number {
    return nbr * 1000
}

export function minutes( nbr:number ): number {
    return nbr * seconds(60)
}

export function pick<T>( list:T[] ): T {
    return list[Math.floor(Math.random()*list.length)]
}

export function pickEnemy( app:App ): Enemy {
    const rdm = Math.random()
    const enemyCount = 2
    let i = 1
    if (rdm < i / enemyCount) return new AyaEnemy(app); else i++
    return new BlobEnemy(app)
}

export function pickBonus( app:App ): Bonus {
    const rdm = Math.random()
    const bonusCount = 12
    let i = 1
    if (rdm < i / bonusCount) return new Heal(app); else i++
    if (rdm < i / bonusCount) return new Star(app); else i++
    if (rdm < i / bonusCount) return new Carnage(app); else i++
    if (rdm < i / bonusCount) return new Drill(app); else i++
    if (rdm < i / bonusCount) return new Falcon(app); else i++
    if (rdm < i / bonusCount) return new Shield(app); else i++
    if (rdm < i / bonusCount) return new Shotgun(app); else i++
    if (rdm < i / bonusCount) return new Bazooka(app); else i++
    if (rdm < i / bonusCount) return new Minigun(app); else i++
    if (rdm < i / bonusCount) return new Sniper(app); else i++
    if (rdm < i / bonusCount) return new DeadChain(app)
    return new Ping(app)
}
