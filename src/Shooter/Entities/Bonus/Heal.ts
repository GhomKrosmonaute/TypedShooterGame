import Bonus from "../Bonus"
import { Consumable } from "../../../interfaces"
import p5 from "p5"
import ellipseColorFadeOut from "../../Animations/ellipseColorFadeOut"

export default class Heal extends Bonus implements Consumable {
  public quantity = 1
  public id = "heal"
  public displayName = "Heal"
  public description = "Full health recovery"

  public exec(): void {
    this.party.player.life = this.party.player.baseLife
    this.party.setAnimation(
      ellipseColorFadeOut({
        className: "high",
        attach: true,
        duration: 100,
        value: this.p.color(0, 255, 0),
        position: this.party.player,
      })
    )
  }

  public shape(p: p5, x: number, y: number, w: number, h: number): void {
    this.p.rect(x + w * 0.4, y + h * 0.2, w * 0.2, h * 0.6, 2)
    this.p.rect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2, 2)
  }

  applyEffect(): void {
    this.party.player.addConsumable(this)
  }
}
