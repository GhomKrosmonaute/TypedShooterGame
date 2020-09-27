import Positionable from "./Positionable"
import Enemy from "./Enemy"
import Player from "./Player"
import { fade } from "../../utils"
import explosion from "../Animations/explosion"
import { Vector2D } from "../../interfaces"
import Dirigible from "./Dirigible"
import Angle from "./Angle"
import Variation from "./Variation"

export default class Shot extends Dirigible {
  public readonly basePosition: Dirigible
  public readonly damage: number
  private readonly speed: number
  private readonly powered: boolean
  private piercingShots: number = 1
  private toIgnore: Enemy[] = []
  private someEnemyHit = false
  private flashing = new Variation(0, 255, 25.5)

  constructor(public player: Player, degrees: number) {
    super(
      player.p,
      player.x,
      player.y,
      player.shotSize,
      new Angle(player.p, degrees)
    )
    this.basePosition = new Dirigible(
      this.p,
      player.x * 10,
      player.y * 10,
      0,
      player.angle
    )
    this.powered = this.angle.degrees === this.basePosition.angle.degrees
    this.basePosition.moveByAngle(player.speed * 2)
    this.speed = this.player.shotSpeed
    this.damage = this.powered
      ? this.player.shotDamage * 2
      : this.player.shotDamage
    const piercingShots = this.player.getPassive("piercingShots")
    if (piercingShots) this.piercingShots += piercingShots.level
  }

  public handleShoot(enemy: Enemy): boolean {
    if (!this.toIgnore.includes(enemy)) {
      this.piercingShots--
      this.toIgnore.push(enemy)
      this.someEnemyHit = true
      if (this.piercingShots === 0) this.terminate()
      return true
    }
    return false
  }

  public terminate(): void {
    if (this.someEnemyHit) this.player.hitCount++
    const explosiveShots = this.player.getPassive("explosiveShots")
    if (explosiveShots) {
      this.player.party.setAnimation(
        explosion({
          className: "low",
          duration: 100,
          position: { x: this.x, y: this.y },
          value: explosiveShots.value * 2,
        })
      )
      for (const enemy of this.player.party.enemies)
        if (this.rawDist(enemy) < explosiveShots.value)
          enemy.inflictDamages(this.damage, true)
    } else {
      this.player.party.setAnimation(
        explosion({
          className: "low",
          duration: 50,
          position: { x: this.x, y: this.y },
          value: this.diameter,
        })
      )
    }
    this.placeOutOfLimits()
  }

  public step(): void {
    if (this.powered) this.flashing.step()
    if (this.rawDist(this.basePosition) > this.player.shotRange) {
      this.terminate()
    } else {
      const autoFireGuidance = this.player.getPassive("autoFireGuidance")
      let target: Vector2D
      if (autoFireGuidance) {
        const temp: {
          enemy: Enemy
          dist: number
        } = {
          enemy: null,
          dist: Infinity,
        }
        for (const enemy of this.player.party.enemies) {
          if (!this.toIgnore.includes(enemy) && !enemy.immune) {
            const dist = enemy.rawDist(this)
            if (dist < autoFireGuidance.value && temp.dist > dist) {
              temp.enemy = enemy
              temp.dist = dist
            }
          }
        }
        target = temp.enemy
      }
      if (target) this.follow(target, this.speed, this.speed * 2)
      else this.moveByAngle(this.speed)
    }
  }

  public draw(): void {
    if (this.isOnScreen())
      this.drawImage(this.player.app.images.shot, {
        tint: this.powered
          ? this.p.color(255, this.flashing.value, this.flashing.value)
          : 255,
      })
  }
}
