import p5 from 'p5';
import App from './Shooter/App';
import Bonus from './Shooter/Bonus';
import Enemy from './Shooter/Enemy';
import PiercingShots from './Shooter/Bonus/PiercingShots';
import DeadlyWave from './Shooter/Bonus/DeadlyWave';
import AutoFireGuidance from './Shooter/Bonus/AutoFireGuidance';
import Heal from './Shooter/Bonus/Heal';
import StarBalls from './Shooter/Bonus/StarBalls';
import Shield from './Shooter/Bonus/Shield';
import DamageUp from './Shooter/Bonus/DamageUp';
import ShotsSizeUp from './Shooter/Bonus/ShotsSizeUp';
import FireRateUp from './Shooter/Bonus/FireRateUp';
import RangeUp from './Shooter/Bonus/RangeUp';
import DeadChain from './Shooter/Bonus/DeadChain';
import ShieldPiercer from './Shooter/Enemies/ShieldPiercer';
import BlobMob from './Shooter/Enemies/BlobMob';
import CircularSaw from "./Shooter/Enemies/CircularSaw";
import Tesla from "./Shooter/Enemies/Tesla";

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
    const rdm = Math.floor(Math.random() * 4)
    switch (rdm) {
        case 0: return new ShieldPiercer(app)
        case 1: return new BlobMob(app)
        case 2: return new CircularSaw(app)
        case 3: return new Tesla(app)
    }
}

export function pickBonus( app:App ): Bonus {
    const rdm = Math.floor(Math.random() * 11)
    switch (rdm) {
        case 0: return new Heal(app)
        case 1: return new StarBalls(app)
        case 2: return new DeadlyWave(app)
        case 3: return new PiercingShots(app)
        case 4: return new AutoFireGuidance(app)
        case 5: return new Shield(app)
        case 6: return new DamageUp(app)
        case 7: return new ShotsSizeUp(app)
        case 8: return new FireRateUp(app)
        case 9: return new RangeUp(app)
        case 10: return new DeadChain(app)
    }
}

export function getInput( id:string ): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement
}
