import p5 from 'p5';
import App from './Shooter/App';
import Bonus from './Shooter/Entities/Bonus';
import Enemy from './Shooter/Entities/Enemy';
import PiercingShots from './Shooter/Entities/Bonus/PiercingShots';
import DeadlyWave from './Shooter/Entities/Bonus/DeadlyWave';
import AutoFireGuidance from './Shooter/Entities/Bonus/AutoFireGuidance';
import Heal from './Shooter/Entities/Bonus/Heal';
import StarBalls from './Shooter/Entities/Bonus/StarBalls';
import Shield from './Shooter/Entities/Bonus/Shield';
import DamageUp from './Shooter/Entities/Bonus/DamageUp';
import ShotsSizeUp from './Shooter/Entities/Bonus/ShotsSizeUp';
import FireRateUp from './Shooter/Entities/Bonus/FireRateUp';
import RangeUp from './Shooter/Entities/Bonus/RangeUp';
import DeadChain from './Shooter/Entities/Bonus/DeadChain';
import ShieldPiercer from './Shooter/Entities/Enemies/ShieldPiercer';
import BlobMob from './Shooter/Entities/Enemies/BlobMob';
import CircularSaw from "./Shooter/Entities/Enemies/CircularSaw";
import Tesla from "./Shooter/Entities/Enemies/Tesla";
import Party from './Shooter/Entities/Scenes/Party';
import Rocket from './Shooter/Entities/Enemies/Rocket';
import Animation from './Shooter/Entities/Animation';
import SpeedUp from './Shooter/Entities/Bonus/SpeedUp';
import Positionable from './Shooter/Entities/Positionable';

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

export function explosion( a:Animation ): void {
    const opacity = a.p.map(a.time,0,a.duration,255,0)
    a.p.noStroke()
    a.p.fill(255,0,0, opacity)
    a.p.ellipse(a.position.x,a.position.y,a.p.map(a.time,0,a.duration,a.value,1))
    a.p.noFill()
    a.p.stroke(255, opacity)
    a.p.strokeWeight(a.p.map(a.time,0,a.duration,1,10))
    a.p.ellipse(a.position.x,a.position.y,a.p.map(a.time,0,a.duration,1,a.value))
}

export function ellipseColorFadeOut( a:Animation ): void {
    const color = a.value as p5.Color
    const entity = a.position as any
    color.setAlpha(a.p.map(a.time,0,a.duration,150,0))
    a.p.noStroke()
    a.p.fill(color)
    a.p.ellipse( a.position.x, a.position.y,entity.currentRadius || entity.radius)
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

export function pickEnemy( party:Party ): Enemy {
    const rdm = Math.floor(Math.random() * 5)
    switch (rdm) {
        case 0: return new ShieldPiercer(party)
        case 1: return new BlobMob(party)
        case 2: return new CircularSaw(party)
        case 3: return new Tesla(party)
        case 4: return new Rocket(party)
    }
}

export function pickBonus( party:Party ): Bonus {
    const rdm = Math.floor(Math.random() * 12)
    switch (rdm) {
        case 0: return new Heal(party)
        case 1: return new StarBalls(party)
        case 2: return new DeadlyWave(party)
        case 3: return new PiercingShots(party)
        case 4: return new AutoFireGuidance(party)
        case 5: return new Shield(party)
        case 6: return new DamageUp(party)
        case 7: return new ShotsSizeUp(party)
        case 8: return new FireRateUp(party)
        case 9: return new RangeUp(party)
        case 10: return new DeadChain(party)
        case 11: return new SpeedUp(party)
    }
}

export function getInput( id:string ): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement
}
