import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
export default class Shoot extends Positionable {
    player: Player;
    readonly basePosition: Positionable;
    readonly direction: Positionable;
    private readonly speed;
    readonly damage: number;
    private drill;
    private toIgnore;
    constructor(player: Player, directionX: number, directionY: number);
    handleShoot(enemy: Enemy): boolean;
    step(): void;
    draw(): void;
    readonly currentRadius: number;
}
