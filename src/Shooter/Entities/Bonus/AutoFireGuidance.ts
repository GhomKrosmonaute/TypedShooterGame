import { Passive } from "../../../interfaces"
import Bonus from "../Bonus"
import p5 from "p5"

export default class AutoFireGuidance extends Bonus implements Passive {
  public level = 1 // 100
  public levelMax = 3 // 200
  public id = "autoFireGuidance"
  public displayName = "Automatic Fire Guidance"
  public description = "{value}px detection"

  shape(p: p5, x: number, y: number, w: number, h: number): void {
    // TODO: psy eye
    this.p.textSize(h * 0.5)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.text("A", x + w * 0.5, y + h * 0.5)
  }

  applyEffect(): void {
    this.party.player.addPassive(this)
  }

  get value(): number {
    return 50 + this.level * 50
  }
}
