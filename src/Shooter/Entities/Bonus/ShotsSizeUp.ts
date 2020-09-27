import Bonus from "../Bonus"
import { Passive } from "../../../interfaces"
import p5 from "p5"
import { map } from "../../../utils"

export default class ShotsSizeUp extends Bonus implements Passive {
  public level = 1
  public levelMax = 3
  public id = "shotsSizeUp"
  public displayName = "Shots Size Up"
  public description = "{value}px"

  applyEffect(): void {
    this.party.player.addPassive(this)
  }

  shape(p: p5, x: number, y: number, w: number, h: number): void {
    p.rect(x + w * 0.2, y + h * 0.2, w * 0.2, h * 0.6)
    p.rect(x + w * 0.6, y + h * 0.2, w * 0.2, h * 0.6)
    p.rect(x + w * 0.4, y + h * 0.4, w * 0.2, h * 0.4)
  }

  get value(): number {
    return map(
      this.level,
      0,
      3,
      this.party.player.baseShotSize,
      this.party.player.baseShotSize * 2
    )
  }
}
