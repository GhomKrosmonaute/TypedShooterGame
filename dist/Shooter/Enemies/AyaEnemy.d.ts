import Enemy from '../Enemy';
import App from '../App';
export default class AyaEnemy extends Enemy {
    speed: number;
    gain: number;
    life: number;
    constructor(app: App);
    pattern(): void;
}
