import { Passive } from "../../../interfaces"
import Bonus from "../Bonus"
import p5 from "p5"

export default class PiercingShots extends Bonus implements Passive {
  public level = 1
  public levelMax = 5
  public id = "piercingShots"
  public displayName = "Piercing Shots"
  public description = "Pierces {value} enemies"

  shape(p: p5, x: number, y: number, w: number, h: number) {
    this.p.ellipse(x + w * 0.5, y + h * 0.5, w * 0.6, h * 0.25)
  }

  applyEffect(): void {
    this.party.player.addPassive(this)
  }

  get value(): number {
    return this.level
  }
}
