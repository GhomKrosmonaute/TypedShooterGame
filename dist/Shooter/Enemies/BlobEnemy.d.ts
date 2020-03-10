import Enemy from '../Enemy';
import App from '../App';
export default class BlobEnemy extends Enemy {
    speed: number;
    baseGain: number;
    baseLife: number;
    gain: number;
    life: number;
    maxLife: number;
    constructor(app: App);
    pattern(): void;
    absorb(enemy: Enemy): void;
}
