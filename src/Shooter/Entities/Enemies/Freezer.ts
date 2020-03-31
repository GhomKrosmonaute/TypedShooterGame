
import Enemy from '../Enemy';
import Party from '../Scenes/Party'
import Shot from "../Shot";
import {Vector2D} from "../../../interfaces";
import { arc } from '../../Shapes/arc';
import {isOnArc, random} from '../../../utils';

export default class Freezer extends Enemy {

    public immune: boolean = false
    public speed: number = 2.5
    public damages: number = 2
    public gain: number = 1
    public life: number = 3
    public id = 'slower'

    constructor( party:Party ) {
        super( party )
        this.diameter = 50
        if(this.app.hardcore){
            this.speed ++
            this.life ++
        }
        this.baseGain = this.gain
        this.baseSpeed = this.speed
        this.baseLife = this.life
        this.baseDamages = this.damages
    }

    public pattern(): void {
        this.follow(this.party.player, this.speed, 10)
        // TODO: Ralentis le joueur et les shots si ils sont dans la zone de freeze
    }

    onPlayerContact(): void {
        this.checkShield()
    }

    shotFilter(shoot: Shot): boolean {
        return true
    }

    overDraw(): void {}

    onDraw(): void {
        this.p.noStroke()
        this.p.fill(this.app.blue())
        this.p.ellipse(
            this.x,
            this.y,
            this.diameter
        )
    }

    public get currentDiameter(){
        return this.lifeBasedDiameter
    }

}
