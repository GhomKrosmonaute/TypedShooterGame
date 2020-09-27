import Bonus from "../Bonus"
import { Passive } from "../../../interfaces"
import p5 from "p5"

export default class RangeUp extends Bonus implements Passive {
  public level = 1 // 375
  public levelMax = 5 // 875
  public id = "rangeUp"
  public displayName = "Range Up"
  public description = "{value}px"

  applyEffect(): void {
    this.party.player.addPassive(this)
  }

  shape(p: p5, x: number, y: number, w: number, h: number): void {
    // TODO: looking for a good shape
    this.p.textSize(h * 0.5)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.text("SN", x + w * 0.5, y + h * 0.5)
  }

  get value(): number {
    return (
      this.party.player.baseShotRange +
      this.level * (this.party.player.baseShotRange * 0.5)
    )
  }
}
