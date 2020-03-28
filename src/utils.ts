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
import ExplosiveShots from './Shooter/Entities/Bonus/ExplosiveShots';
import {AnimationMinimalOptions, AnimationOptions, Vector2D} from './interfaces';
import {LIMITS, VIEWPORT} from './config';

export function constrain( n:number, low:number, high:number ): number {
    return Math.max(Math.min(n, high), low);
}

export function dist( x1:number, y1:number, x2:number, y2:number ): number {
    return hypot(x2 - x1, y2 - y1)
}

export function map( n:number,
    start1:number, stop1:number,
    start2:number, stop2:number,
    withinBounds:boolean = false
): number {
    const output = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
    if(!withinBounds) return output
    return start2 < stop2 ?
        constrain(output, start2, stop2) :
        constrain(output, stop2, start2)
}

export function norm( n:number, start:number, stop:number ): number {
    return map(n, start, stop, 0, 1)
}

export function random( min?:number[]|number, max?:number ): number {
    let rand = Math.random()
    if (typeof min === 'undefined') {
        return rand
    } else if (typeof max === 'undefined') {
        if (min instanceof Array) {
            return min[Math.floor(rand * min.length)]
        } else {
            return rand * min
        }
    } else {
        if (min > max) {
            const tmp = min as number
            min = max
            max = tmp
        }
        //@ts-ignore
        return rand * (max - min) + min
    }
}

export function hypot( x:number, y:number, z?:number ) {

    if (typeof Math.hypot === 'function') {
        return Math.hypot.apply(null, arguments);
    }

    const length = arguments.length;
    const args = [];
    let max = 0;
    for (let i = 0; i < length; i++) {
        let n = arguments[i];
        n = +n;
        if (n === Infinity || n === -Infinity) {
            return Infinity;
        }
        n = Math.abs(n);
        if (n > max) {
            max = n;
        }
        args[i] = n;
    }

    if (max === 0) {
        max = 1;
    }
    let sum = 0;
    let compensation = 0;
    for (let j = 0; j < length; j++) {
        const m = args[j] / max;
        const summand = m * m - compensation;
        const preliminary = sum + summand;
        compensation = preliminary - sum - summand;
        sum = preliminary;
    }
    return Math.sqrt(sum) * max;
}

export function fade( fadeMax:number,
    fadeIn: { value:number, valueMax:number, fadeMax?:number, overflow:number },
    fadeOut?: { value:number, valueMax:number, fadeMax?:number, overflow:number }
): number {
    if(!fadeOut) fadeOut = fadeIn
    return constrain(
        Math.min(
            map(fadeOut.value,0,fadeOut.valueMax, fadeOut.fadeMax || fadeMax * fadeOut.overflow, 0),
            map(fadeIn.value,0,fadeIn.valueMax,0,fadeIn.fadeMax || fadeMax * fadeIn.overflow)
        ),
        0,
        fadeMax
    )
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
    const rdm = Math.floor(Math.random() * 13)
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
        case 12: return new ExplosiveShots(party)
    }
}

export function getInput( id:string ): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement
}

export function isOnScreen( p:p5, vector:Vector2D ): boolean {
    return (
        vector.x > p.width * -.5 &&
        vector.x < p.width * .5 &&
        vector.y > p.height * -.5 &&
        vector.y < p.height * .5
    )
}

export function isOutOfLimits( vector:Vector2D ): boolean {
    return rawDist({ x:0, y:0 }, vector) > LIMITS
}

export function isOutOfViewPort( vector:Vector2D ): boolean {
    return rawDist({ x:0, y:0 }, vector) > VIEWPORT
}

export function rawDist(
    vector1:Vector2D,
    vector2:Vector2D
): number {
    return dist(
        vector1.x, vector1.y,
        vector2.x, vector2.y
    )
}

export function isOnArc(
    a:Vector2D,
    b:Vector2D,
    target:Vector2D,
    arcWeight:number
): boolean {
    if(!target) return false
    return rawDist(a,target) + rawDist(b,target) < rawDist(a,b) + arcWeight
}
