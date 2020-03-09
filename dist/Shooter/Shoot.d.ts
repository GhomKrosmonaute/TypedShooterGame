import Positionable from './Positionable';
import Enemy from './Enemy';
import Player from './Player';
export default class Shoot extends Positionable {
    player: Player;
    private readonly directionX;
    private readonly directionY;
    private readonly speed;
    readonly damage: number;
    private drill;
    private toIgnore;
    constructor(player: Player, directionX: number, directionY: number);
    handleShoot(enemy: Enemy): boolean;
    step(): void;
    draw(): void;
}
