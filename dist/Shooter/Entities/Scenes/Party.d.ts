import Scene from '../Scene';
import Enemy from '../Enemy';
import Bonus from '../Bonus';
import Particles from '../Particles';
import Player from '../Player';
import App from '../../App';
export default class PartyScene extends Scene {
    private readonly maxEnemyCount;
    private readonly minEnemyCount;
    background: Particles;
    foreground: Particles;
    bonusState: number;
    lastBonusState: number;
    enemies: Enemy[];
    bonus: Bonus[];
    player: Player;
    constructor(app: App);
    reset(): void;
    draw(): void;
    step(): Promise<void>;
    keyPressed(key: string): void;
    move(x: number, y: number): void;
    readonly enemyCount: number;
}
