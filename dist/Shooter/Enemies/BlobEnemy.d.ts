import Enemy from '../Enemy';
import App from '../App';
export default class BlobEnemy extends Enemy {
    speed: number;
    gain: number;
    life: number;
    maxLife: number;
    id: string;
    constructor(app: App);
    pattern(): void;
    absorb(enemy: Enemy): void;
}
