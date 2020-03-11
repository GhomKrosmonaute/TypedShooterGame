import p5 from 'p5';
import App from './Shooter/App';
import Bonus from './Shooter/Bonus';
import Enemy from './Shooter/Enemy';
import Drill from './Shooter/Bonus/Drill';
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
import MineEnemy from "./Shooter/Enemies/MineEnemy";

export function fade( p:p5, fadeMax:number,
    fadeIn: { value:number, valueMax:number, fadeMax?:number, overflow:number },
    fadeOut?: { value:number, valueMax:number, fadeMax?:number, overflow:number }
): number {
    if(!fadeOut) fadeOut = fadeIn
    return Math.max(
        0,
        Math.min(
            fadeMax,
            p.map(fadeOut.value,0,fadeOut.valueMax, fadeOut.fadeMax || fadeMax * fadeOut.overflow, 0),
            p.map(fadeIn.value,0,fadeIn.valueMax,0,fadeIn.fadeMax || fadeMax * fadeIn.overflow)
        )
    )
}

export function star( p:p5, x:number, y:number, radiusIn:number, radiusOut:number, points:number): void {
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
    const rdm = Math.floor(Math.random() * 3)
    switch (rdm) {
        case 0: return new AyaEnemy(app)
        case 1: return new BlobEnemy(app)
        case 2: return new MineEnemy(app)
    }
}

export function pickBonus( app:App ): Bonus {
    const rdm = Math.floor(Math.random() * 12)
    switch (rdm) {
        case 0: return new Heal(app)
        case 1: return new Star(app)
        case 2: return new Carnage(app)
        case 3: return new Drill(app)
        case 4: return new Falcon(app)
        case 5: return new Shield(app)
        case 6: return new Shotgun(app)
        case 7: return new Bazooka(app)
        case 8: return new Minigun(app)
        case 9: return new Sniper(app)
        case 10: return new DeadChain(app)
        case 11: return new Ping(app)
    }
}
