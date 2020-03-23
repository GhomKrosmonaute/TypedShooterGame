import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
export default class Shot extends Positionable {
    player: Player;
    readonly basePosition: Positionable;
    readonly direction: Positionable;
    private readonly speed;
    readonly damage: number;
    private piercingShots;
    private toIgnore;
    constructor(player: Player, directionX: number, directionY: number);
    handleShoot(enemy: Enemy): boolean;
    terminate(): void;
    step(): void;
    draw(): void;
}
