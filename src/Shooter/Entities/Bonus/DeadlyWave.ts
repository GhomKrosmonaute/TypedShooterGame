import Bonus from "../Bonus"
import { Consumable } from "../../../interfaces"
import { VIEWPORT } from "../../../config"
import p5 from "p5"
import explosion from "../../Animations/explosion"

export default class DeadlyWave extends Bonus implements Consumable {
  public quantity = 1
  public id = "deadlyWave"
  public displayName = "Deadly Wave"
  public description = "Kill enemies hit by " + VIEWPORT + "px wave"

  public applyEffect() {
    this.party.player.addConsumable(this)
  }

  public exec(): void {
    this.party.setAnimation(
      explosion({
        className: "low",
        value: VIEWPORT * 2,
        duration: 200,
      })
    )
    this.party.enemies.forEach((enemy) => {
      if (!enemy.immune && this.party.player.rawDist(enemy) < VIEWPORT)
        enemy.kill(true)
    })
  }

  public shape(p: p5, x: number, y: number, w: number, h: number): void {
    p.ellipse(x + w * 0.5, y + h * 0.4, w * 0.7, h * 0.5)
    p.rect(x + w * 0.35, y + h * 0.4, w * 0.3, h * 0.4)
  }
}
